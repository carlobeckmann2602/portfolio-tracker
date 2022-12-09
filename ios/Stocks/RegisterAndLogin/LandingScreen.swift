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
            .font(.custom("Roboto Serif", size: 24))
            .fontWeight(.bold)
            .foregroundColor(.white)
            .padding([.top], 27)
        }
        Spacer()
        VStack(spacing: 25) {
          Text("Sign in to manage all your stocks in one place!")
            .font(.custom("Roboto", size: 20))
            .fontWeight(.light)
            .foregroundColor(.white)
          ActionButton(action: registerAction, text: "Register")
          HStack {
            Divider().frame(width: 125, height: 2).background(AppColors.PRIMARY)
            Text("or").padding([.leading, .trailing], 10)
            Divider().frame(width: 125, height: 2).background(AppColors.PRIMARY)
          }
          Button {
            loginAction()
          } label: {
            Text("Log-in")
              .font(.custom("Roboto", size: 18))
              .fontWeight(.bold)
              .foregroundColor(.white).underline()
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
