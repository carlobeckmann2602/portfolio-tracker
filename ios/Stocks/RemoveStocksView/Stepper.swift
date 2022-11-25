//
//  Stepper.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.11.22.
//

import Foundation
import SwiftUI

struct StepperView: View {
    @State private var amount = 0
//    @State var portfolioEntry: PortfolioEntry
    
    func incrementStep() {
        amount += 1
        
    }
    
    func decrementStep() {
        amount -= 1
        
    }
    
    var body: some View {
        HStack{
            Text("Amount: \(amount)        ")
            Stepper {
            } onIncrement: {
                incrementStep()
            } onDecrement: {
                decrementStep()
            }
            .padding(5)
            .frame(width: 100, height: 35)
            .offset(x: -4)
            .background(Color.white)
            .cornerRadius(8)
        }
    }
    
}
