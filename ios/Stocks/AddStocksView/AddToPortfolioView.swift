//
//  AddToPortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 19.11.22.
//

import Foundation
import SwiftUI

struct AddToPortfolioView: View {
  var stock: Stock
  var portfolio: Portfolio
  var portfolioHandler: PortfolioHandler

  @State var input = "1"
  @State private var todayDate = Date.now
  var body: some View {
    ZStack {
      LinearGradient(
        gradient: Gradient(colors: [
          AppColors.LIGHT_PURPLE
        ]), startPoint: .top,
        endPoint: .bottom
      ).ignoresSafeArea()
      VStack(alignment: .leading) {
        HStack {
          Text(stock.name).roboto(size: 40, weight: .bold)
        }.padding()
        HStack {
          Text("Total stocks purchased").roboto(size: 20, weight: .light)
          TextField("", text: $input)
            .padding()
            .overlay(
              RoundedRectangle(cornerRadius: 12)
                .stroke(AppColors.PRIMARY, lineWidth: 1)
            ).frame(width: 100, height: 2)
        }.padding()
        HStack {
          Text("Money spent (in euros)").roboto(size: 20, weight: .light)
          Text(String(amountSpend()))
            .padding()
            .overlay(
              RoundedRectangle(cornerRadius: 12)
                .stroke(AppColors.PRIMARY, lineWidth: 1)
            ).frame(width: 100, height: 2)
        }.padding()
        HStack {
          DatePicker(selection: $todayDate, in: ...Date.now, displayedComponents: .date) {
            Text("Purchase Date").roboto(size: 20, weight: .light)
          }
          //            Text("Date is \(todayDate.formatted(date: .long, time: .omitted))")
        }.padding()
        Button {

          do {
            try portfolioHandler.addToPortfolio(
              stockId: stock.id, amount: stockNumberToPurchase(), pricePerUnit: 50, date: todayDate,
              onComplete: { portfolioEntry in
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                  portfolio.addStockToPortfolio(portfolioEntry: portfolioEntry)
                }
              })
          } catch {
            print("error when adding to portfolio \(error)")
          }
          NavigationUtils.popToRootView()

        } label: {
          Text("Add")
            .roboto(size: 20, weight: .medium)
            .frame(width: 300, height: 50)
        }
        .background(AppColors.PRIMARY)
        .cornerRadius(8)
        .padding()
      }
    }
  }
  func stockNumberToPurchase() -> Int {
    return Int(input) ?? 0
  }
  func amountSpend() -> Int {
    return Int(stock.getValue()) * (Int(input) ?? 0)
  }
}
