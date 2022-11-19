//
//  StockListCell.swift
//  Stocks
//
//  Created by Jan Honsbrok on 19.11.22.
//

import Foundation
import SwiftUI

struct StockListCell: View {
  var stock: Stock
  var body: some View {
    HStack {
      Image(systemName: "arrow.up.circle.fill")
        .font(.system(size: 30))
      VStack(alignment: .leading) {
        Text(stock.name)
        Text("+2,5%")
          .font(.system(size: 12))
      }
      Spacer()
      Text(String(format: "%.2f€", stock.value))
    }
  }
}

struct StockListCell_Previews: PreviewProvider {
  static var previews: some View {
    StockListCell(stock: ModelData().stocks[0])
  }
}
