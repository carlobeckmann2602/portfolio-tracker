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
      Image(systemName: stock.getArrow())
        .font(.system(size: 30))
      VStack(alignment: .leading) {
        Text(stock.name)
          .roboto(size: 20, weight: .regular)
        Text(stock.getTrend())
          .roboto(size: 18)
      }
      Spacer()
      Text(String(format: "%.2f€", stock.getValue()))
        .roboto(size: 18)
    }

  }
}
