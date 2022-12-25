//
//  OnboardingStep2.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.12.22.
//

//
//  OnboardingStep1.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.12.22.
//

import Foundation
import SwiftUI

struct OnboardingStep2: View {
  var body: some View {
    ZStack {
      LinearGradient(
        gradient: Gradient(colors: [AppColors.PURPLE, AppColors.BACKGROUND]), startPoint: .top,
        endPoint: .bottom
      ).ignoresSafeArea()
      VStack {
        VStack(spacing: 25) {
          Text("Step 2")
            .robotoSerif(size: 45, weight: .bold)
            .padding([.top], 100)
          Text(
            "Select a stock to view the details, modify the amount or remove it from your personal portfolio."
          )
          .roboto(size: 20, weight: .light)
          .frame(width: 300)
          .cornerRadius(10)
          Spacer()
          Button {
            goToLogin()
          } label: {
            Text("Register")
              .roboto(size: 20, weight: .bold)
              .padding()
              .background(
                LinearGradient(
                  gradient: Gradient(colors: [
                    AppColors.PURPLE,
                    Color(hex: "#6472D8"),
                    AppColors.PRIMARY,
                  ]), startPoint: .leading,
                  endPoint: .trailing
                ).frame(width: 300)
                  .cornerRadius(10)
              ).frame(width: 300)
          }
          HStack {
            Button {
              goToLogin()
            } label: {
              Text("Skip onboarding")
                .roboto(size: 15)
                .underline()
            }
          }
        }
      }
    }.preferredColorScheme(.dark)
  }
}

struct OnboardingStep2_Previews: PreviewProvider {
  static var previews: some View {
    OnboardingStep2()
  }
}
