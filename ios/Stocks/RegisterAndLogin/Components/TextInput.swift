//
//  TextInput.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import SwiftUI

struct TextInput: View {
  let iconName: String
  let label: String
  @State var inputText: String = ""
  var body: some View {
    ZStack {
      Color(hex: "#2f2256")
        .frame(width: 300, height: 50)
        .cornerRadius(10)
      HStack {
        Image(systemName: self.iconName)
          .foregroundColor(Color(hex: "#999999"))
          .padding(16)
        TextField(
          self.label, text: $inputText,
          prompt: Text(self.label)
            .foregroundColor(Color(hex: "#999999"))
        )
        .textFieldStyle(PlainTextFieldStyle()).foregroundColor(.white)
        .keyboardType(
          .emailAddress)
        Spacer()
      }.frame(width: 300, height: 50)
    }
  }
}

struct TextInput_Previews: PreviewProvider {
  static var previews: some View {
    TextInput(iconName: "envelope", label: "Email")
  }
}
