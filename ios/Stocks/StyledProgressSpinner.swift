//
//  StyledProgressBar.swift
//  Stocks
//
//  Created by Jan Honsbrok on 12.01.23.
//

import Foundation
import SwiftUI

struct StyledProgressSpinner: View {
  var text: String
  var body: some View {
    ProgressView {
      Text(text).roboto(size: 20)
    }
  }
}
