//
//  TextField+Extensions.swift
//  Stocks
//
//  Created by Jan Honsbrok on 10.12.22.
//

import Foundation
import SwiftUI

extension Text {

  func roboto(size: Double = 20, weight: Font.Weight = .light, foregroundColor: Color = .white)
    -> Text
  {
    return self.font(.custom("Roboto", size: size))
      .fontWeight(weight)
      .foregroundColor(foregroundColor)
  }

  func robotoSerif(size: Double = 20, weight: Font.Weight = .light, foregroundColor: Color = .white)
    -> Text
  {
    return self.font(.custom("Roboto Serif", size: size))
      .fontWeight(weight)
      .foregroundColor(foregroundColor)
  }
}
