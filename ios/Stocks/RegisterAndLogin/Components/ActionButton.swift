//
//  LandingScreen.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import SwiftUI

struct ActionButton: View {
  let text: String
  var body: some View {
    Button {

    } label: {
      Text(self.text)
        .font(.custom("Roboto", size: 20))
        .fontWeight(.bold)
        .foregroundColor(.white)
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
            .cornerRadius(10))
    }
  }
}

struct ActionButton_Previews: PreviewProvider {
  static var previews: some View {
    ActionButton(text: "Register")
  }
}
