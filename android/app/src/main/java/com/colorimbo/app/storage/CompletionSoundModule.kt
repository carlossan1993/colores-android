package com.colorimbo.app.storage

import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import java.io.IOException

// One native audio module for the short completion cue and the approved,
// locally bundled Colorimbo soundtrack. No network or new permissions.
@ReactModule(name = CompletionSoundModule.NAME)
class CompletionSoundModule(
  private val reactContext: ReactApplicationContext
) : NativeCompletionSoundSpec(reactContext), LifecycleEventListener {
  private val handler = Handler(Looper.getMainLooper())
  private var activeTone: ToneGenerator? = null
  private var backgroundPlayer: MediaPlayer? = null
  private var musicRequested = false
  private var foreground = true
  private var disposed = false

  init {
    reactContext.addLifecycleEventListener(this)
  }

  override fun getName() = NAME

  override fun playCompletion() {
    handler.post {
      if (disposed) return@post
      try {
        activeTone?.stopTone()
        activeTone?.release()
        val tone = ToneGenerator(AudioManager.STREAM_MUSIC, 25)
        activeTone = tone
        tone.startTone(ToneGenerator.TONE_PROP_ACK, 150)
        handler.postDelayed({
          if (activeTone === tone) {
            tone.release()
            activeTone = null
          }
        }, 220)
      } catch (_: RuntimeException) {
        activeTone = null
      }
    }
  }

  override fun setBackgroundMusicEnabled(enabled: Boolean) {
    handler.post {
      if (disposed) return@post
      musicRequested = enabled
      syncBackgroundMusic()
    }
  }

  private fun newPlayer(): MediaPlayer {
    // Asset must be committed before merging this PR. openFd avoids writing
    // files to the phone and works with uncompressed MP3 assets in the APK.
    val player = MediaPlayer()
    try {
      reactContext.assets.openFd(ASSET_NAME).use { descriptor ->
        player.setDataSource(descriptor.fileDescriptor, descriptor.startOffset, descriptor.length)
      }
      player.setAudioAttributes(
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_GAME)
          .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
          .build()
      )
      player.isLooping = true
      player.setVolume(BACKGROUND_VOLUME, BACKGROUND_VOLUME)
      player.prepare()
      return player
    } catch (error: Exception) {
      player.release()
      throw error
    }
  }

  private fun syncBackgroundMusic() {
    if (disposed) return
    try {
      if (!musicRequested || !foreground) {
        if (backgroundPlayer?.isPlaying == true) {
          backgroundPlayer?.pause()
        }
        return
      }
      if (backgroundPlayer == null) {
        backgroundPlayer = newPlayer()
      }
      if (backgroundPlayer?.isPlaying == false) {
        backgroundPlayer?.start()
      }
    } catch (_: IOException) {
      releaseMusic()
    } catch (_: RuntimeException) {
      // Missing audio output must never interrupt painting or saving.
      releaseMusic()
    }
  }

  private fun releaseMusic() {
    backgroundPlayer?.let { player ->
      try {
        player.release()
      } catch (_: RuntimeException) {
        // Best-effort release during teardown or audio-device failure.
      }
    }
    backgroundPlayer = null
  }

  override fun onHostResume() {
    handler.post {
      foreground = true
      syncBackgroundMusic()
    }
  }

  override fun onHostPause() {
    handler.post {
      foreground = false
      syncBackgroundMusic()
    }
  }

  override fun onHostDestroy() {
    handler.post {
      foreground = false
      musicRequested = false
      releaseMusic()
    }
  }

  override fun invalidate() {
    reactContext.removeLifecycleEventListener(this)
    handler.post {
      disposed = true
      musicRequested = false
      releaseMusic()
      activeTone?.stopTone()
      activeTone?.release()
      activeTone = null
    }
    super.invalidate()
  }

  companion object {
    const val NAME = "NativeCompletionSound"
    private const val ASSET_NAME = "colorimbo_music.mp3"
    private const val BACKGROUND_VOLUME = 0.20f
  }
}
