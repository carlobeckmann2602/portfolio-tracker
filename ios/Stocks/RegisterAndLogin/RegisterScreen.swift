//
//  LandingScreen.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import SwiftUI

struct RegisterScreen: View {

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
        TextInput(iconName: "envelope", label: "Email")
          .padding([.top], 30)
        TextInput(iconName: "lock", label: "Password")
          .padding([.top], 30)
        TextInput(iconName: "lock", label: "Repeat Password")
          .padding([.top], 5)
        ActionButton(text: "Register").padding([.top], 30)
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
    RegisterScreen()
  }
}
