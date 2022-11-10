//
//  PortfolioStock.swift
//  Stocks
//
//  Created by Carlo Beckmann on 09.11.22.
//

import Foundation

struct PortfolioStock: Hashable, Codable, Identifiable {
    var id = UUID()
    var stock: Stock
    var amount: Float
}
