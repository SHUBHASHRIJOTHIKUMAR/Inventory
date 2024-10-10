USE [Inventory]
GO

/****** Object:  StoredProcedure [dbo].[GetOrders]    Script Date: 28/09/2024 9:57:46 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE  [dbo].[GetOrders]    
AS    
BEGIN    
   -- SELECT id, item_id, quantity, total_price, status FROM Orders;    
  
  
 select a.item_id,a.quantity,b.name,a.total_price,
 CAST('data:image/jpeg;base64,' + CAST(N'' AS XML).value('xs:base64Binary(sql:column("a.imagedata"))', 'VARCHAR(MAX)') AS VARCHAR(MAX)) AS stockImage
  from orders a  
left outer join stock b on a.item_id=b.id;  


END
GO

