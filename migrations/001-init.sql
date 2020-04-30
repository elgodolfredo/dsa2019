-- Up 
CREATE TABLE `vulnerabilities` (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT
);
INSERT INTO `vulnerabilities` VALUES(1, 'extract');
INSERT INTO `vulnerabilities` VALUES(2, 'SQL injection');

CREATE TABLE `repositories` (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    vulnerability_id INTEGER NOT NULL,
    url TEXT, 
    file TEXT,
    code TEXT,
    updated_at TEXT
);

-- Down 
DROP TABLE IF EXISTS `repositories`;
DROP TABLE IF EXISTS `vulnerabilities`;