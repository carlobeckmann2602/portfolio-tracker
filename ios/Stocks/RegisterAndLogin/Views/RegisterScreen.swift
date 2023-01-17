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
  @State var errorMessage: String = ""

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
            .robotoSerif(size: 45, weight: .bold)
            .padding([.top], 130)
          Text("Please create an Account to join GoFundYourself.")
            .roboto(size: 20)
            .padding([.top], 0)
        }
        Spacer()
        VStack {
          TextInput(
            iconName: "envelope",
            label: "Email",
            text: $emailText
          )
          .padding([.top], 20)
          Text(errorMessage)
            .roboto(size: 15, foregroundColor: .red)
            .padding(.top, 5)
          TextInput(
            iconName: "lock",
            label: "Password",
            text: $passwordText,
            secure: true
          )
          .padding([.top], 20)
          TextInput(
            iconName: "lock",
            label: "Repeat Password",
            text: $password2Text,
            secure: true
          )
          .padding([.top], 5)
        }
        Spacer()
        ActionButton(
          action: {
            authenticationHandler.register(
              email: emailText, password: passwordText, password2: password2Text,
              onError: { errorMessage in
                self.errorMessage = errorMessage
              })
          }, text: "Register"
        ).padding([.top], 20)
        VStack {
          HStack {
            Text("Already have an account?")
              .roboto(size: 15)
            Button {
              loginRequested()
            } label: {
              Text("Log in")
                .roboto(size: 15, foregroundColor: AppColors.PRIMARY)
                .underline()
            }
          }.padding([.top], 15)
          Button {
            emailText = "ios-\(UUID())@test.com"
            passwordText = "securepassword"
            password2Text = "securepassword"
          } label: {
            Text("Debug autofill")
              .roboto(size: 15)
              .underline()
          }.padding([.top], 5)
        }
        Spacer()
        Image("logo_white")
          .resizable()
          .frame(width: 75, height: 75)
      }
    }
  }
}

struct RegisterScreen_Previews: PreviewProvider {
  static var previews: some View {
    RegisterScreen(loginRequested: {})
  }
}
