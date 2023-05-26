DROP INDEX IF EXISTS ykid_root;
DROP TABLE IF EXISTS ykid;

DROP INDEX IF EXISTS yitem_root;
DROP TABLE IF EXISTS yitem;

CREATE TABLE IF NOT EXISTS yitem (
    id bigint NOT NULL, 
    userid varchar(20) NOT NULL,
    content text NOT NULL,
    unixstamp bigint NOT NULL,
    parent bigint NOT NULL,
    rootid bigint NOT NULL,

    primary key (id)
);

CREATE INDEX IF NOT EXISTS yitem_root
ON yitem(rootid);

CREATE TABLE IF NOT EXISTS ykid (
    id bigint NOT NULL,   
    kid bigint NOT NULL,
    rootid bigint NOT NULL,
    
    primary key (id, kid),
    foreign key (id) references yitem(id),
    foreign key (kid) references yitem(id)
);

CREATE INDEX IF NOT EXISTS ykid_root 
ON ykid(rootid);

