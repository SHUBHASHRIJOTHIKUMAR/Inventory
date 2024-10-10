USE [Inventory]
GO

/****** Object:  StoredProcedure [dbo].[GetStock]    Script Date: 28/09/2024 9:57:56 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetStock]  
AS  
BEGIN  
    --SELECT id, name, quantity, price,imagedata FROM Stock;  
	SELECT id, name, quantity, price, CAST('data:image/jpeg;base64,' + CAST(N'' AS XML).value('xs:base64Binary(sql:column("imagedata"))', 'VARCHAR(MAX)') AS VARCHAR(MAX)) AS stockImage
FROM stock;
END  
GO

