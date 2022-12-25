//
//  OnboardingStep1.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.12.22.
//

import Foundation
import SwiftUI

func goToLogin() {
  if let window = UIApplication.shared.windows.first {
    window.rootViewController = UIHostingController(rootView: ContentView())
    window.makeKeyAndVisible()
  }
}

func goToNext() {
  if let window = UIApplication.shared.windows.first {
    window.rootViewController = UIHostingController(rootView: OnboardingStep2())
    window.makeKeyAndVisible()
  }
}

struct OnboardingStep1: View {
  var body: some View {
    ZStack {
      LinearGradient(
        gradient: Gradient(colors: [AppColors.PURPLE, AppColors.BACKGROUND]), startPoint: .top,
        endPoint: .bottom
      ).ignoresSafeArea()
      VStack {
        VStack(spacing: 25) {
          Text("Step 1")
            .robotoSerif(size: 45, weight: .bold)
            .padding([.top], 100)
          Text("Add stocks to the pie chart by clicking on the + button")
            .roboto(size: 20, weight: .light)
            .frame(width: 300)
            .cornerRadius(10)
          Text("Search stocks by name and select the quantity and price.")
            .roboto(size: 20, weight: .light)
            .frame(width: 300)
            .cornerRadius(10)
          Spacer()
          Button {
            UserDefaults.standard.set(true, forKey: "didLaunchBefore")
            goToNext()
          } label: {
            Text("Next")
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
              UserDefaults.standard.set(true, forKey: "didLaunchBefore")
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

struct OnboardingStep1_Previews: PreviewProvider {
  static var previews: some View {
    OnboardingStep1()
  }
}
