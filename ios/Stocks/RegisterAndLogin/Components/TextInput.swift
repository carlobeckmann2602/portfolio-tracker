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
  let text: Binding<String>
  let secure: Bool

  init(iconName: String, label: String, text: Binding<String>) {
    self.iconName = iconName
    self.label = label
    self.text = text
    self.secure = false
  }

  init(iconName: String, label: String, text: Binding<String>, secure: Bool) {
    self.iconName = iconName
    self.label = label
    self.text = text
    self.secure = secure
  }

  var body: some View {
    ZStack {
      Color(hex: "#2f2256")
        .frame(width: 300, height: 50)
        .cornerRadius(10)
      HStack {
        Image(systemName: self.iconName)
          .foregroundColor(Color(hex: "#999999"))
          .padding(16)
        if secure {
          SecureField(
            label, text: text,
            prompt: Text(self.label)
              .foregroundColor(Color(hex: "#999999")))
        } else {
          TextField(
            self.label, text: text,
            prompt: Text(self.label)
              .foregroundColor(Color(hex: "#999999"))
          )
          .textFieldStyle(PlainTextFieldStyle()).foregroundColor(.white)
          .keyboardType(
            .emailAddress)
        }
        Spacer()
      }.frame(width: 300, height: 50)
    }
  }
}
