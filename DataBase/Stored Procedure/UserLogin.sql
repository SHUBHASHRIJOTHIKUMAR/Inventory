USE [Inventory]
GO

/****** Object:  StoredProcedure [dbo].[UserLogin]    Script Date: 28/09/2024 9:58:24 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[UserLogin]
    @Username VARCHAR(50),          -- Username entered by the user
    @Password VARCHAR(255)          -- Password entered by the user
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @StoredPassword VARCHAR(255);
    DECLARE @UserId INT;
    DECLARE @IsActive BIT;

    -- Fetch the stored password, id, and is_active status for the username
    SELECT @StoredPassword = password, @UserId = id, @IsActive = is_active 
    FROM loginusers 
    WHERE username = @Username and is_active=1;

    -- Check if the user exists
    IF @StoredPassword IS NOT NULL
    BEGIN
        -- Compare the provided password with the stored password
        IF @StoredPassword = @Password
        BEGIN
            -- Return user details if the password matches
            SELECT @UserId AS id, @Username AS username, @IsActive AS is_active, created_at, updated_at
            FROM loginusers
            WHERE username = @Username ;
        END
        ELSE
        BEGIN
            -- Return an error message if the password doesn't match
            SELECT 'Invalid username or password' AS ErrorMessage;
        END
    END
    ELSE
    BEGIN
        -- Return an error message if the user is not found
        SELECT 'Invalid username or password' AS ErrorMessage;
    END
END;
GO

