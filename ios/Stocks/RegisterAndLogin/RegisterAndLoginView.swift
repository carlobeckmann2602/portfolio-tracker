//
//  LandingScreen.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import SwiftUI

enum LoginState {
  case landing
  case register
  case login
}

struct RegisterAndLoginView: View {
  @State var currentState: LoginState = .landing
  var body: some View {
    if currentState == .landing {
      LandingScreen(
        registerAction: {
          currentState = .register
          print("register")
        },
        loginAction: {
          currentState = .login
        })
    } else if currentState == .register {
      RegisterScreen()
    } else {
      LoginScreen()
    }
  }
}

struct RegisterAndLoginView_Previews: PreviewProvider {
  static var previews: some View {
    RegisterAndLoginView()
  }
}
