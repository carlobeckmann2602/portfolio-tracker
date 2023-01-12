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
  @ObservedObject var authenticationHandler: AuthenticationHandler = AuthenticationHandler()
  var body: some View {
    if authenticationHandler.isLoggedIn {
      PortfolioView(
        portfolioHandler: PortfolioHandler(authenticationHandler: authenticationHandler),
        authenticationHandler: authenticationHandler)
    } else {
      if currentState == .landing {
        LandingScreen(
          registerAction: {
            currentState = .register
          },
          loginAction: {
            currentState = .login
          })
      } else if currentState == .register {
        RegisterScreen(loginRequested: {
          currentState = .login
        }).environmentObject(authenticationHandler)
      } else {
        LoginScreen(registerRequested: {
          currentState = .register
        }).environmentObject(authenticationHandler)
      }
    }
  }
}

struct RegisterAndLoginView_Previews: PreviewProvider {
  static var previews: some View {
    RegisterAndLoginView()
  }
}
