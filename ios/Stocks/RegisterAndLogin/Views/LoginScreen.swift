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
          HStack {
            Spacer()
          }.frame(width: 280)
          Text("Welcome")
            .robotoSerif(size: 45, weight: .bold)
            .padding([.top], 130)
          Text("back!")
            .robotoSerif(size: 45, weight: .bold)
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
          Text(errorMessage)
              .foregroundColor(.red)
              .padding(.top, 5)
        ActionButton(
          action: {
              authenticationHandler.login(email: emailText, password: passwordText, onError: { errorMessage in
                  self.errorMessage = errorMessage
                  self.passwordText = ""
              })
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
        Button {
          emailText = "ios-testing@test.com"
          passwordText = "securepassword"
        } label: {
          Text("Use Debug Account")
            .roboto(size: 15)
            .underline()
        }.padding([.top], 5)
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
