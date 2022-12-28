//
//  PortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Foundation
import SwiftUI

struct PortfolioLoadedView: View {
  @ObservedObject var portfolio: Portfolio

  var body: some View {
    VStack(alignment: .leading) {
      VStack {
        HStack {
          Text("Your balance")
            .roboto(size: 25, weight: .regular)
          Spacer()
        }
        HStack {
          Text(String(format: "%.2f€", portfolio.totalValue()))
            .roboto(size: 40, weight: .bold, foregroundColor: AppColors.PRIMARY)
          Spacer()
          NavigationLink(
            destination: AddStocksView(portfolio: portfolio).navigationTitle(
              "Add Stock")
          ) {
            Label("add", systemImage: "plus.circle")
              .font(.system(size: 50)).fontWeight(.ultraLight)
              .foregroundColor(AppColors.PRIMARY)
              .labelStyle(.iconOnly)
          }
        }
      }.padding()
      ZStack {
        Rectangle()
          .fill(.white)
          .opacity(0.15)
          .frame(maxWidth: .infinity)
          .cornerRadius(radius: 40.0, corners: [.topLeft, .topRight])
          .ignoresSafeArea()
        if portfolio.isEmpty() {
          Text("Your portfolio is empty, add a ").foregroundColor(Color.white)
        } else {
          PieChart(
            portfolio: portfolio,
            separatorColor: Color(UIColor.systemBackground),
            innerColor: Color(hex: "#3a2e60"),
            accentColors: pieColors
          ).padding()
        }
      }
    }
    .navigationTitle("Portfolio")
    .preferredColorScheme(.dark)
  }

}

struct PortfolioView: View {
  var networkAdapter: NetworkAdapter

  var body: some View {
    NavigationView {
      ZStack {
        AppColors.BACKGROUND.ignoresSafeArea()
        AsyncContentView(
          loadable: PortfolioLoader(networkAdapter: networkAdapter),
          loadingView: ProgressView("Loading Portfolio..").tint(.white).foregroundColor(Color.white)
        ) { portfolio in
          PortfolioLoadedView(portfolio: portfolio)
        }

      }
    }
  }
}
/*
struct PortfolioView_Previews: PreviewProvider {
  static var previews: some View {
    PortfolioView()
      .environmentObject(ModelData())
  }
}*/
