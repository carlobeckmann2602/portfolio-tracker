//
//  LandingScreen.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import SwiftUI

struct LoginScreen: View {
  let registerRequested: () -> Void

  @EnvironmentObject
  var authenticationHandler: AuthenticationHandler

  @State var emailText: String = ""
  @State var passwordText: String = ""

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
          Text("Welcome back!")
            .robotoSerif(size: 45, weight: .bold)
            .padding([.top], 130)
          Text("Please log in to your GoFundYourself Account.")
            .roboto(size: 20)
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
          text: $passwordText,
          secure: true
        )
        .padding([.top], 5)
        ActionButton(
          action: {
            authenticationHandler.login(email: emailText, password: passwordText)
          }, text: "Login"
        ).padding([.top], 30)
        HStack {
          Text("No account?")
            .roboto(size: 15)
          Button {
            registerRequested()
          } label: {
            Text("Create one")
              .roboto(size: 15, foregroundColor: AppColors.PRIMARY)
              .underline()
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

struct LoginScreen_Previews: PreviewProvider {
  static var previews: some View {
    LoginScreen(registerRequested: {})
  }
}
