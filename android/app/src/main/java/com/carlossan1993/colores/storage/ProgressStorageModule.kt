package com.carlossan1993.colores.storage

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import java.util.concurrent.Executors

@ReactModule(name = ProgressStorageModule.NAME)
class ProgressStorageModule(context: ReactApplicationContext) : NativeProgressStorageSpec(context) {
  private val preferences = context.getSharedPreferences("colores_progress", Context.MODE_PRIVATE)
  private val worker = Executors.newSingleThreadExecutor()

  override fun getName() = NAME

  override fun readSnapshot(promise: Promise) = read("snapshot", promise)
  override fun readBackup(promise: Promise) = read("backup", promise)

  private fun read(key: String, promise: Promise) {
    worker.execute {
      try {
        promise.resolve(preferences.getString(key, null))
      } catch (error: Exception) {
        promise.reject("PROGRESS_READ_FAILED", "No se pudo leer el progreso local", error)
      }
    }
  }

  override fun writeSnapshot(value: String, promise: Promise) {
    worker.execute {
      try {
        require(value.length <= 262144) { "Progress snapshot is too large" }
        // Both copies commit together; resolve only after Android confirms the disk write.
        val saved = preferences.edit()
          .putString("snapshot", value)
          .putString("backup", value)
          .commit()
        if (saved) promise.resolve(null)
        else promise.reject("PROGRESS_WRITE_FAILED", "No se pudo guardar el progreso local")
      } catch (error: Exception) {
        promise.reject("PROGRESS_WRITE_FAILED", "No se pudo guardar el progreso local", error)
      }
    }
  }

  override fun invalidate() {
    worker.shutdown()
    super.invalidate()
  }

  companion object {
    const val NAME = "NativeProgressStorage"
  }
}
