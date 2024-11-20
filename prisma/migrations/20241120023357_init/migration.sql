-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "Book_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "Community_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expirationDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "charSet" TEXT NOT NULL,
    "expiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

INSERT INTO Permission VALUES('clnf2zvli0000pcou3zzzzome','create','user','own','',1696625465526,1696625465526);
INSERT INTO Permission VALUES('clnf2zvll0001pcouly1310ku','create','user','any','',1696625465529,1696625465529);
INSERT INTO Permission VALUES('clnf2zvll0002pcouka7348re','read','user','own','',1696625465530,1696625465530);
INSERT INTO Permission VALUES('clnf2zvlm0003pcouea4dee51','read','user','any','',1696625465530,1696625465530);
INSERT INTO Permission VALUES('clnf2zvlm0004pcou2guvolx5','update','user','own','',1696625465531,1696625465531);
INSERT INTO Permission VALUES('clnf2zvln0005pcoun78ps5ap','update','user','any','',1696625465531,1696625465531);
INSERT INTO Permission VALUES('clnf2zvlo0006pcouyoptc5jp','delete','user','own','',1696625465532,1696625465532);
INSERT INTO Permission VALUES('clnf2zvlo0007pcouw1yzoyam','delete','user','any','',1696625465533,1696625465533);
INSERT INTO Permission VALUES('clnf2zvlp0008pcou9r0fhbm8','create','note','own','',1696625465533,1696625465533);
INSERT INTO Permission VALUES('clnf2zvlp0009pcouj3qib9q9','create','note','any','',1696625465534,1696625465534);
INSERT INTO Permission VALUES('clnf2zvlq000apcouxnspejs9','read','note','own','',1696625465535,1696625465535);
INSERT INTO Permission VALUES('clnf2zvlr000bpcouf4cg3x72','read','note','any','',1696625465535,1696625465535);
INSERT INTO Permission VALUES('clnf2zvlr000cpcouy1vp6oeg','update','note','own','',1696625465536,1696625465536);
INSERT INTO Permission VALUES('clnf2zvls000dpcouvzwjjzrq','update','note','any','',1696625465536,1696625465536);
INSERT INTO Permission VALUES('clnf2zvls000epcou4ts5ui8f','delete','note','own','',1696625465537,1696625465537);
INSERT INTO Permission VALUES('clnf2zvlt000fpcouk29jbmxn','delete','note','any','',1696625465538,1696625465538);

INSERT INTO Role VALUES('clnf2zvlw000gpcour6dyyuh6','admin','',1696625465540,1696625465540);
INSERT INTO Role VALUES('clnf2zvlx000hpcou5dfrbegs','user','',1696625465542,1696625465542);

INSERT INTO _PermissionToRole VALUES('clnf2zvll0001pcouly1310ku','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlm0003pcouea4dee51','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvln0005pcoun78ps5ap','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlo0007pcouw1yzoyam','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlp0009pcouj3qib9q9','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlr000bpcouf4cg3x72','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvls000dpcouvzwjjzrq','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlt000fpcouk29jbmxn','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvli0000pcou3zzzzome','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvll0002pcouka7348re','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlm0004pcou2guvolx5','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlo0006pcouyoptc5jp','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlp0008pcou9r0fhbm8','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlq000apcouxnspejs9','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlr000cpcouy1vp6oeg','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvls000epcou4ts5ui8f','clnf2zvlx000hpcou5dfrbegs');

-- Initialize admin user
INSERT INTO User VALUES('cm3nq0fbx000asffyddtlo2eg','jon.winsley@gmail.com','jon','Jon',1731976369053,1731976369053);
INSERT INTO Password VALUES('$2a$10$nR9dp1T.7xCByuiDztV4eOYd9uQaFgGDwZe9bxcNaZomAsdrcQWQq','cm3nq0fbx000asffyddtlo2eg');
INSERT INTO _RoleToUser VALUES('clnf2zvlw000gpcour6dyyuh6','cm3nq0fbx000asffyddtlo2eg');
INSERT INTO _RoleToUser VALUES('clnf2zvlx000hpcou5dfrbegs','cm3nq0fbx000asffyddtlo2eg');