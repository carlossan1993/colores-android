package com.carlossan1993.colores.storage

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class ProgressStoragePackage : BaseReactPackage() {
  override fun getModule(name: String, context: ReactApplicationContext): NativeModule? =
    if (name == ProgressStorageModule.NAME) ProgressStorageModule(context) else null

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(ProgressStorageModule.NAME to ReactModuleInfo(
      name = ProgressStorageModule.NAME,
      className = ProgressStorageModule::class.java.name,
      canOverrideExistingModule = false,
      needsEagerInit = false,
      isCxxModule = false,
      isTurboModule = true
    ))
  }
}
