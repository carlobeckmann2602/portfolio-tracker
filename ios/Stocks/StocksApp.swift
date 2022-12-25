//
//  StocksApp.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import SwiftUI

@main
struct StocksApp: App {
  @AppStorage("didLaunchBefore") var didLaunchBefore: Bool = false

  var body: some Scene {
    WindowGroup {
      if didLaunchBefore {
        ContentView()
      } else {
        OnboardingStep1()
      }
    }
  }
}
