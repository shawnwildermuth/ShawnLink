BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Shawn].[Redirects]') AND [c].[name] = N'Key');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Shawn].[Redirects] DROP CONSTRAINT ' + @var + ';');
UPDATE [Shawn].[Redirects] SET [Key] = N'' WHERE [Key] IS NULL;
ALTER TABLE [Shawn].[Redirects] ALTER COLUMN [Key] nvarchar(100) NOT NULL;
ALTER TABLE [Shawn].[Redirects] ADD DEFAULT N'' FOR [Key];

DECLARE @var1 nvarchar(max);
SELECT @var1 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Shawn].[Redirects]') AND [c].[name] = N'Domain');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Shawn].[Redirects] DROP CONSTRAINT ' + @var1 + ';');
UPDATE [Shawn].[Redirects] SET [Domain] = N'' WHERE [Domain] IS NULL;
ALTER TABLE [Shawn].[Redirects] ALTER COLUMN [Domain] nvarchar(100) NOT NULL;
ALTER TABLE [Shawn].[Redirects] ADD DEFAULT N'' FOR [Domain];

DECLARE @var2 nvarchar(max);
SELECT @var2 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Shawn].[Redirects]') AND [c].[name] = N'Destination');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Shawn].[Redirects] DROP CONSTRAINT ' + @var2 + ';');
UPDATE [Shawn].[Redirects] SET [Destination] = N'' WHERE [Destination] IS NULL;
ALTER TABLE [Shawn].[Redirects] ALTER COLUMN [Destination] nvarchar(1024) NOT NULL;
ALTER TABLE [Shawn].[Redirects] ADD DEFAULT N'' FOR [Destination];

DECLARE @var3 nvarchar(max);
SELECT @var3 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Shawn].[Links]') AND [c].[name] = N'Url');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Shawn].[Links] DROP CONSTRAINT ' + @var3 + ';');
UPDATE [Shawn].[Links] SET [Url] = N'' WHERE [Url] IS NULL;
ALTER TABLE [Shawn].[Links] ALTER COLUMN [Url] nvarchar(1024) NOT NULL;
ALTER TABLE [Shawn].[Links] ADD DEFAULT N'' FOR [Url];

DECLARE @var4 nvarchar(max);
SELECT @var4 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Shawn].[Links]') AND [c].[name] = N'Key');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Shawn].[Links] DROP CONSTRAINT ' + @var4 + ';');
UPDATE [Shawn].[Links] SET [Key] = N'' WHERE [Key] IS NULL;
ALTER TABLE [Shawn].[Links] ALTER COLUMN [Key] nvarchar(100) NOT NULL;
ALTER TABLE [Shawn].[Links] ADD DEFAULT N'' FOR [Key];

DECLARE @var5 nvarchar(max);
SELECT @var5 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Shawn].[Links]') AND [c].[name] = N'Domain');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Shawn].[Links] DROP CONSTRAINT ' + @var5 + ';');
UPDATE [Shawn].[Links] SET [Domain] = N'' WHERE [Domain] IS NULL;
ALTER TABLE [Shawn].[Links] ALTER COLUMN [Domain] nvarchar(25) NOT NULL;
ALTER TABLE [Shawn].[Links] ADD DEFAULT N'' FOR [Domain];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20221108071527_IsRequired', N'10.0.8');

COMMIT;
GO

