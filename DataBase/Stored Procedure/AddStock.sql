USE [Inventory]
GO

/****** Object:  StoredProcedure [dbo].[AddStock]    Script Date: 28/09/2024 9:57:35 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

  
CREATE PROCEDURE [dbo].[AddStock]    
    @p_name VARCHAR(255),    
    @p_quantity INT,    
    @p_price DECIMAL(10, 2)  ,
    @p_image VARBINARY(MAX)  -- Adding image data parameter
AS    
BEGIN    
    INSERT INTO stock (name, quantity, price, imagedata) VALUES (@p_name, @p_quantity, @p_price,@p_image);    
END;    
GO

