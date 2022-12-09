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
      return LandingScreen()
    } else if currentState == .register {
      return RegisterScreen()
    } else {
      return LoginScreen()
    }
  }
}

struct RegisterAndLoginView_Previews: PreviewProvider {
  static var previews: some View {
    RegisterAndLoginView()
  }
}
