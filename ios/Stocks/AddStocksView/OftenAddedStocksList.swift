//
//  StockList.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

struct OftenAddedStocksList: View {
  var body: some View {
    List {
      ForEach(ModelData().stocks) { stock in
        StockListCell(stock: stock)
      }
    }
  }
}
