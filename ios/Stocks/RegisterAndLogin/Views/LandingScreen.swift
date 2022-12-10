//
//  LandingScreen.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import SwiftUI

struct LandingScreen: View {
  let registerAction: () -> Void
  let loginAction: () -> Void
  var body: some View {
    ZStack {
      LinearGradient(
        gradient: Gradient(colors: [AppColors.PURPLE, AppColors.BACKGROUND]), startPoint: .top,
        endPoint: .bottom
      ).ignoresSafeArea()
      VStack {
        VStack {
          Image("logo_white")
            .resizable()
            .frame(width: 160, height: 160)
            .padding([.top], 166)
          Text("GoFundYourself")
            .robotoSerif(size: 24, weight: .bold)
            .padding([.top], 27)
        }
        Spacer()
        VStack(spacing: 25) {
          Text("Sign in to manage all your stocks in one place!")
            .roboto(size: 20, weight: .light)
          ActionButton(action: registerAction, text: "Register")
          HStack {
            Divider().frame(width: 125, height: 2).background(AppColors.PRIMARY)
            Text("or")
              .roboto(size: 16)
              .padding([.leading, .trailing], 10)
            Divider().frame(width: 125, height: 2).background(AppColors.PRIMARY)
          }
          Button {
            loginAction()
          } label: {
            Text("Log-in")
              .roboto(size: 18, weight: .bold)
              .underline()
          }
        }
      }
    }.preferredColorScheme(.dark)
  }
}

struct LandingScreen_Previews: PreviewProvider {
  static var previews: some View {
    LandingScreen(registerAction: {}, loginAction: {})
  }
}
