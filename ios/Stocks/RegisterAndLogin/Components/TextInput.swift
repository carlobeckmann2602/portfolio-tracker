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
          self.label, text: text,
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
