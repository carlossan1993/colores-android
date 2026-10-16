package com.colorimbo.app.storage

import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

// Built-in Android audio: no files, downloads, permissions, or third-party SDKs.
@ReactModule(name = CompletionSoundModule.NAME)
class CompletionSoundModule(context: ReactApplicationContext) : NativeCompletionSoundSpec(context) {
  private val handler = Handler(Looper.getMainLooper())
  private var activeTone: ToneGenerator? = null

  override fun getName() = NAME

  override fun playCompletion() {
    handler.post {
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
        // Audio is optional; unsupported sound output never breaks coloring.
        activeTone = null
      }
    }
  }

  override fun invalidate() {
    handler.post {
      activeTone?.stopTone()
      activeTone?.release()
      activeTone = null
    }
    super.invalidate()
  }

  companion object {
    const val NAME = "NativeCompletionSound"
  }
}
