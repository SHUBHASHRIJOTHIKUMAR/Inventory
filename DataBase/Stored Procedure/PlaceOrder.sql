USE [Inventory]
GO

/****** Object:  StoredProcedure [dbo].[PlaceOrder]    Script Date: 28/09/2024 9:58:13 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[PlaceOrder]  
    @p_item_id INT,  
    @p_quantity INT,  
    @p_order_id INT OUTPUT,  
    @p_message VARCHAR(255) OUTPUT
AS  
BEGIN  
    DECLARE @currentStock INT;  
    DECLARE @price DECIMAL(10, 2);  
    DECLARE @total_price DECIMAL(10, 2);  
  
    -- Get current stock and price  
    SELECT @currentStock = quantity, @price = price  
    FROM stock   
    WHERE id = @p_item_id;  
  
    -- Check if item exists  
    IF @currentStock IS NULL  
    BEGIN  
        SET @p_message = 'Item not found';  
        SET @p_order_id = NULL;  -- Set order ID to NULL  
        RETURN;  -- Exit the procedure  
    END  
  
    -- Check if there is enough stock  
    IF @currentStock < @p_quantity  
    BEGIN  
        SET @p_message = 'Insufficient stock available';  
        SET @p_order_id = NULL;  -- Set order ID to NULL  
        RETURN;  -- Exit the procedure  
    END  
  
    -- Calculate total price  
    SET @total_price = @price * @p_quantity;  
  
    -- Insert order into orders table including image data
    INSERT INTO orders (item_id, quantity, total_price)   
    VALUES (@p_item_id, @p_quantity, @total_price);  
  
    -- Get the last inserted order ID  
    SET @p_order_id = SCOPE_IDENTITY();  
  
    -- Insert into transactions table  
    INSERT INTO transactions (order_id, stock_id, quantity)   
    VALUES (@p_order_id, @p_item_id, @p_quantity);  
  
    -- Update stock quantity  
    UPDATE stock   
    SET quantity = @currentStock - @p_quantity   
    WHERE id = @p_item_id;  
  
    -- Set success message
    SET @p_message = 'Order dispatched successfully';  
END;
GO

