-- CreateTable
CREATE TABLE "GithubUser" (
    "id" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "avatarUrl" TEXT,
    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubRepo" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "htmlUrl" TEXT NOT NULL,
    "language" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "userId" INTEGER NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "GithubRepo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "GithubUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubUser_login_key" ON "GithubUser"("login");

-- CreateIndex
CREATE INDEX "GithubRepo_userId_idx" ON "GithubRepo"("userId");
