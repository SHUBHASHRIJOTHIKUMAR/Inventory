USE [Inventory]
GO

/****** Object:  Table [dbo].[orders]    Script Date: 28/09/2024 9:56:02 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[orders](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[item_id] [int] NOT NULL,
	[quantity] [int] NOT NULL,
	[total_price] [decimal](10, 2) NOT NULL,
	[created_at] [datetime2](7) NULL,
	[status] [varchar](10) NULL,
	[ImageData] [varbinary](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[orders] ADD  DEFAULT ('Pending') FOR [status]
GO

ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([item_id])
REFERENCES [dbo].[stock] ([id])
GO

ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([status]='Dispatched' OR [status]='Pending'))
GO

