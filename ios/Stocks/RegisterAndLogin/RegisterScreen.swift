//
//  LandingScreen.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import Just
import SwiftUI

struct RegisterScreen: View {
  let loginRequested: () -> Void
  @EnvironmentObject
  var authenticationHandler: AuthenticationHandler

  @State var emailText: String = ""
  @State var passwordText: String = ""
  @State var password2Text: String = ""

  var body: some View {
    ZStack {
      LinearGradient(
        gradient: Gradient(colors: [
          AppColors.PURPLE,
          AppColors.BACKGROUND,
          AppColors.BACKGROUND,
        ]), startPoint: .top,
        endPoint: .bottom
      ).ignoresSafeArea()
      VStack {
        VStack(alignment: .leading) {
          Text("Welcome!")
            .font(.custom("Roboto Serif", size: 45))
            .fontWeight(.bold)
            .foregroundColor(.white)
            .padding([.top], 130)
          Text("Please create an Account to join GoFundYourself.")
            .font(.custom("Roboto", size: 20))
            .fontWeight(.light)
            .foregroundColor(.white)
            .padding([.top], 0)
        }
        Spacer()
        TextInput(
          iconName: "envelope",
          label: "Email",
          text: $emailText
        )
        .padding([.top], 30)
        TextInput(
          iconName: "lock",
          label: "Password",
          text: $passwordText
        )
        .padding([.top], 30)
        TextInput(
          iconName: "lock",
          label: "Repeat Password",
          text: $password2Text
        )
        .padding([.top], 5)
        ActionButton(
          action: {
            authenticationHandler.register(
              email: emailText, password: passwordText, password2: password2Text)
          }, text: "Register"
        ).padding([.top], 30)
        HStack {
          Text("Already have an account?").font(.custom("Roboto", size: 15))
            .fontWeight(.light)
            .foregroundColor(.white)
          Button {
            loginRequested()
          } label: {
            Text("Log in").font(.custom("Roboto", size: 15))
              .fontWeight(.light)
              .foregroundColor(AppColors.PRIMARY).underline()
          }
        }.padding([.top], 20)
        Spacer()
        Image("logo_white")
          .resizable()
          .frame(width: 85, height: 85)
      }
    }
  }
}

struct RegisterScreen_Previews: PreviewProvider {
  static var previews: some View {
    RegisterScreen(loginRequested: {})
  }
}
