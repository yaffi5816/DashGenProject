
CREATE DATABASE DashGen2026

CREATE TABLE Categories
(
CategoryID  int identity(100,5) primary key,
 
CategoryName varchar(100)  unique not null
)



CREATE TABLE Products
(
ProductID  int identity(1,1) primary key,
CategoryID  int references Categories not null,
ProductName varchar(100)  unique not null ,
ProductDescreption varchar(max) ,
Price float not null check (price>0),
ImgUrl varchar(200)  unique
)



CREATE TABLE Users
(
UserID  int identity(1,1) primary key,
[Password] varchar(100) not null,
[UserName] varchar(100)  unique not null ,
FirstName varchar(100),
LastName varchar(100),
IsAdmin BIT NOT NULL DEFAULT 0
)

CREATE TABLE Orders
(
OrderID  int identity(100,5) primary key,
UserID  int references Users not null,
currentStatus BIT NOT NULL DEFAULT 0,
OrderDate date default getdate(),
OrdersSum float  not null ,
OriginalSchema varchar(max),
GeneratedCode varchar(max)
)




CREATE TABLE Orders_Items
(
OrderItemID  int identity(1,1) primary key,
ProductID int references Products not null ,
OrderID  int references Orders not null,
Quantity int not null
)


INSERT INTO Categories (CategoryName) VALUES 
('KPIs'),
('Charts'),
('Tables');


INSERT INTO Products (CategoryID, ProductName, ProductDescreption, Price, ImgUrl) VALUES 
(100, 'Cart Abandonment Funnel Card', 'Displays dropout rate in a horizontal thermometer format: Added to Cart, Reached Checkout, and Final Purchase.', 230.0, '/images/KPI_1.png'),
(100, 'LTV vs. CAC Card', 'Visual comparison of acquisition costs against expected customer value using overlapping bars.', 200.0, '/images/KPI_2.png'),
(100, 'Sales Velocity Gauge', 'Speedometer format showing sales per minute/hour with dynamic color-shifting background.', 260.0, '/images/KPI_3.png'),
(100, 'Loyalty Tier Score Card', 'Distribution of customers across loyalty levels (New, Returning, VIP) with diamond/crown icons.', 160.0, '/images/KPI_4.png'),
(100, 'Revenue Source Split Card', 'Total revenue with a multi-colored segment bar (Social, Direct, Search) acting as a filter toggle.', 240.0, '/images/KPI_5.png'),
(100, 'Return Rate Pulse Card', 'Percentage of returns inside a dark circle with an inverted arrow animation for quality alerts.', 180.0, '/images/KPI_6.png'),
(100, 'Critical Stock Alert Card', 'Number of at-risk products featuring a blinking background or prominent exclamation mark.', 140.0, '/images/KPI_7.png'),
(100, 'ROAS Gauge', 'Advertising efficiency on a semi-circle divided into Loss (Red), Break-even (Yellow), and Profit (Green).', 230.0, '/images/KPI_8.png'),
(100, 'Average Time-to-Purchase Card', 'Duration from first entry to final purchase, visualized with a filling stopwatch icon.', 170.0, '/images/KPI_9.png'),
(100, 'Basket Density Card', 'Average items per order represented by a shopping basket icon filled with product units.', 195.0, '/images/KPI_10.png'),
(100, 'Trending Product KPI', 'Highlights the top-selling product from the last 60 minutes with a Flame icon and thumbnail.', 210.0, '/images/KPI_11.png'),
(100, 'NPS Sentiment Card', 'Colorful scale from 1 to 10 with a Dynamic Emoji reflecting customer satisfaction levels.', 185.0, '/images/KPI_12.png'),
(100, 'Dead Stock Counter', 'Monetary value of products unmoved for 90+ days, paired with a locked chest icon.', 150.0, '/images/KPI_13.png'),
(100, 'Daily Record Tracker', 'Progress bar comparing current sales to the highest historical sales day (e.g., Black Friday).', 160.0, '/images/KPI_14.png'),
(100, 'Live Order Location Pin', 'Current order volume with a Map Pin icon and text identifying the most recent purchase location.', 225.0, '/images/KPI_15.png');




INSERT INTO Products (CategoryID, ProductName, ProductDescreption, Price, ImgUrl) VALUES 
(110, 'Product Variant Grid', 'A table showing parent products with nested sub-rows for every size/color combination, including dedicated stock columns for each variant.', 350.0, '/images/Table_12.png'),
(110, 'Inventory Status Color-Coded Table', 'Cell backgrounds change automatically based on stock levels (Green: In Stock, Orange: Low, Red: Out of Stock) with a Quick Restock button.', 250.0, '/images/Table_13.png'),
(110, 'Comparison Matrix Layout', 'A structure where columns represent products and rows represent attributes (Price, Material, Features), with a Best Value row highlighted.', 300.0, '/images/Table_14.png'),
(110, 'Actionable Order Queue', 'Includes Quick Action buttons in every row, such as Print Label, Send to Warehouse, or Contact Customer.', 400.0, '/images/Table_15.png'),
(110, 'Customer Purchase History Overlay', 'A minimalist table where hovering over an order ID opens a floating tooltip/popover with a detailed itemized list.', 200.0, '/images/Table_16.png'),
(110, 'Split-View Inventory Manager', 'Clicking a row in the main left table updates a secondary table on the right showing stock distribution across different warehouses.', 500.0, '/images/Table_17.png'),
(110, 'Drag-and-Drop Reorder Table', 'Enables shop managers to drag rows up or down to manually set the product display priority on the storefront.', 450.0, '/images/Table_18.png'),
(110, 'Coupon & Discount Tracker', 'Features a Usage Status column with a progress bar showing how many times a coupon has been used against its maximum limit.', 200.0, '/images/Table_19.png'),
(110, 'Multi-Currency Price List', 'Displays product prices in multiple currencies in adjacent columns, with live exchange rates shown in the header.', 300.0, '/images/Table_20.png'),
(110, 'Return & Refund Request Table', 'Includes a Return Reason column with color-coded tags (Damaged, Not as Described, Late Delivery) and a pending-time counter.', 250.0, '/images/Table_21.png'),
(110, 'Wholesale Volume Pricing Table', 'Displays tiered pricing (1-10 units, 11-50 units, etc.) with automatic calculation of the percentage discount per tier.', 350.0, '/images/Table_22.png'),
(110, 'Abandoned Cart Recovery Table', 'Lists customers who left items in their cart, including Time Since Abandonment and a direct Send Coupon button.', 400.0, '/images/Table_23.png'),
(110, 'Review & Rating Moderation Grid', 'Features a visual star-rating column and a text preview with one-click Approve or Reject buttons.', 300.0, '/images/Table_24.png'),
(110, 'Shipping Logic/Rates Table', 'A technical table centralizing shipping zones, weight brackets, and costs for back-end logistics management.', 450.0, '/images/Table_25.png'),
(110, 'Cross-Sell Insight Table', 'Displays top products alongside a Frequently Bought Together column with correlation percentages.', 350.0, '/images/Table_26.png');


INSERT INTO Products (CategoryID, ProductName, ProductDescreption, Price, ImgUrl) VALUES 
(105, 'Sales Heatmap Grid', 'A grid chart displaying days of the week vs. hours of the day. Cells are colored in varying shades based on sales volume to identify optimal times.', 250.0, '/images/Chart_1.png'),
(105, 'Sankey Revenue Flow', 'A flow diagram showing how money moves from Traffic Source through the Landing Page to the final Product Category purchased.', 450.0, '/images/Chart_2.png'),
(105, 'Customer Cohort Retention Chart', 'A color-coded table analyzing customers by their first purchase month and showing how many returned to buy in subsequent months.', 350.0, '/images/Chart_3.png'),
(105, 'Radar Product Performance', 'A spider web chart comparing a single product across conversion rate, return rate, review score, profitability, and inventory turnover.', 200.0, '/images/Chart_4.png'),
(105, 'Bubble Basket Analysis', 'A scatter plot where each bubble is a category. X-axis is Avg items per basket and Y-axis is Avg basket value.', 300.0, '/images/Chart_5.png'),
(105, 'Real-Time Sales Pulse', 'A live line chart updating every few seconds, displaying current order volume against a typical days average.', 400.0, '/images/Chart_6.png'),
(105, 'Funnel Conversion Waterfall', 'A tiered display showing user progression: Product View -> Add to Cart -> Checkout Start -> Purchase.', 300.0, '/images/Chart_7.png'),
(105, 'Price Elasticity Scatter Plot', 'A chart displaying the relationship between product price and units sold over time to help identify the Golden Price point.', 350.0, '/images/Chart_8.png'),
(105, 'Geographic Sales Clusters', 'An interactive map grouping sales by region, where larger circles indicate high customer density.', 450.0, '/images/Chart_9.png'),
(105, 'Stacked CAC vs. LTV over Time', 'A chart comparing Customer Acquisition Cost against cumulative Lifetime Value to see when a customer becomes profitable.', 350.0, '/images/Chart_10.png'),
(105, 'Inventory Aging Sunburst', 'A multi-layered circular chart displaying warehouse stock. Darker outer layers indicate older inventory.', 400.0, '/images/Chart_11.png'),
(105, 'Box Plot Profit Margins', 'A chart showing the distribution of profitability for products within a category, helping to identify outliers.', 250.0, '/images/Chart_12.png'),
(105, 'Bullet Graph Inventory Targets', 'A compact, dense chart showing current stock levels against desired minimum and maximum lines.', 150.0, '/images/Chart_13.png'),
(105, 'Customer Lifetime Value Prediction', 'A chart using a dashed line to predict future revenue from existing customers based on historical behavior.', 450.0, '/images/Chart_14.png'),
(105, 'Ad Spend ROAS Treemap', 'Squares representing channels where size is budget spent and color is the Return on Ad Spend (ROAS).', 300.0, '/images/Chart_15.png');


DELETE FROM Orders;