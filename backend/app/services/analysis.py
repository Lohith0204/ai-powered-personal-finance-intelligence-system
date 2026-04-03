import pandas as pd

def generate_insights(df_clean: pd.DataFrame, amt_col: str, type_col: str, date_col: str) -> dict:
    insights = {
        "total_spend": 0.0,
        "category_totals": {},
        "smart_insights": []
    }
    
    if amt_col:
        if type_col:
            expense_df = df_clean[df_clean[type_col].str.lower() != 'income'].copy()
        else:
            expense_df = df_clean.copy()
            
        insights["total_spend"] = float(expense_df[amt_col].sum())
        
        # Category totals
        grouped = expense_df.groupby('Predicted Category')[amt_col].sum().reset_index()
        grouped = grouped.sort_values(by=amt_col, ascending=False)
        insights["category_totals"] = grouped.set_index('Predicted Category')[amt_col].to_dict()
        
        # Time-based analysis for smart insights
        if date_col:
            expense_df[date_col] = pd.to_datetime(expense_df[date_col], errors='coerce')
            expense_df['Month'] = expense_df[date_col].dt.to_period('M')
            month_grouped = expense_df.groupby(['Month', 'Predicted Category'])[amt_col].sum().reset_index()
            
            unique_months = sorted(expense_df['Month'].dropna().unique())
            if len(unique_months) >= 2:
                last_month = unique_months[-1]
                prev_month = unique_months[-2]
                
                last_month_data = month_grouped[month_grouped['Month'] == last_month]
                prev_month_data = month_grouped[month_grouped['Month'] == prev_month]
                
                for cat in insights["category_totals"].keys():
                    v_last = last_month_data[last_month_data['Predicted Category'] == cat][amt_col].sum()
                    v_prev = prev_month_data[prev_month_data['Predicted Category'] == cat][amt_col].sum()
                    if v_prev > 0:
                        diff = ((v_last - v_prev) / v_prev) * 100
                        if diff > 15:
                            insights["smart_insights"].append(f"⚠️ {cat} spending increased by {diff:.1f}% compared to last month.")
                        elif diff < -15:
                            insights["smart_insights"].append(f"📉 Great job! Your {cat} spending dropped by {abs(diff):.1f}% this month.")
                            
        # Generate generic Smart Insights
        if insights["category_totals"]:
            top_category = max(insights["category_totals"], key=insights["category_totals"].get)
            top_amount = insights["category_totals"][top_category]
            
            if insights["total_spend"] > 0:
                pct = (top_amount / insights["total_spend"]) * 100
                insights["smart_insights"].insert(0, f"You spent {pct:.1f}% of your budget on {top_category}.")
                
                investment_sum = sum(v for k, v in insights["category_totals"].items() if 'invest' in k.lower() or 'saving' in k.lower())
                if investment_sum == 0 or (investment_sum / insights["total_spend"]) < 0.1:
                    insights["smart_insights"].append("⚠️ Your investment/savings ratio is low. Try to follow the 50/30/20 rule!")
                    
    return insights
