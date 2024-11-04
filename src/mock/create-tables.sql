-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS history CASCADE;

DROP TABLE IF EXISTS transactions CASCADE;

DROP TABLE IF EXISTS messages CASCADE;

DROP TABLE IF EXISTS chat CASCADE;

-- Create Users table
CREATE TABLE users (
    id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    wallet VARCHAR(255),
    -- wallet_id VARCHAR(255),
    balance double precision,
    is_verify boolean,
    -- CONSTRAINT users_pkey PRIMARY KEY (id) CONSTRAINT users_walletid_fkey FOREIGN KEY (wallet_id) REFERENCES wallets (id)
);

-- CREATE TABLE wallets (
--     id VARCHAR(255) NOT NULL,
--     balance double precision,
--     wallet VARCHAR(255)
--     CONSTRAINT wallets_pkey PRIMARY KEY (id)
-- );

-- Create history table 
CREATE TABLE history (
    id VARCHAR(255) NOT NULL,
    amount double precision,
    action VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    card VARCHAR(255),
    wallet VARCHAR(255),
    comment VARCHAR(255),
    transact_id VARCHAR(255),
    CONSTRAINT history_pkey PRIMARY KEY (id)
);

-- Create transactions table with a foreign key to history table
CREATE TABLE transactions (
    id VARCHAR(255) NOT NULL,
    reciever_id VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    amount double precision,
    status VARCHAR(255),
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_recieverid_fkey FOREIGN KEY (reciever_id) REFERENCES history (id),
    CONSTRAINT transactions_senderid_fkey FOREIGN KEY (sender_id) REFERENCES history (id)
);

-- Create chat table with a foreign key to user table
CREATE TABLE chat (
    chat_id VARCHAR(255) NOT NULL,
    user1_id VARCHAR(255) NOT NULL,
    user2_id VARCHAR(255) NOT NULL,
    last_message_id VARCHAR(255),
    wallet_1 VARCHAR(255),
    wallet_2 VARCHAR(255),
    CONSTRAINT chat_pkey PRIMARY KEY (chat_id),
    CONSTRAINT chat_user1_id_user2_id_key UNIQUE (user1_id, user2_id),
    CONSTRAINT chat_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT chat_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -- Create message table with a foreign key to user table
CREATE TABLE messages (
    message_id VARCHAR(255) NOT NULL,
    text text NOT NULL,
    send_date VARCHAR(255) NOT NULL,
    chat_id VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    CONSTRAINT messages_pkey PRIMARY KEY (message_id),
    CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES chat (chat_id) ON DELETE CASCADE
);

-- Insert mock data to user table
INSERT INTO
    users (id, email, password, wallet, balance, is_verify)
VALUES
    (
        '3p1ckdk20tsr5nhozu45',
        'bkolodiy2001@gmail.com',
        '$2b$10$cHTzQjXeEiqIxEW0/Sh1vOXVtfp/LfYL5nGQ7jBRrE3peRL3ZvBA.',
        '4798811485900948',
        '1000',
        True
    ),
    (
        'k7oilq4nabo6d58pbo1y',
        'dsfds@gmail.com',
        '$2b$10$DjDGO/RbdbN7xFIX5sd0LuQKQKqj38rOuLMVBIDWtRrDR5WXAmUm6',
        '2849708795244879',
        '50',
        True
    ),
    (
        'xn22vjo65ano1zsi2clw',
        'bkolodiy20013@gmail.com',
        '$2b$10$/PX6nJNA1R/qowGOYl2evuHMP.pyXZO94op7XIBoWIhU7lNcEviaK',
        '3449231059191161',
        '0',
        True
    );

-- Insert mock data to history table
INSERT INTO
    history(
        id,
        amount,
        action,
        userid,
        status,
        date,
        card,
        wallet,
        comment,
        transact_id
    )
VALUES
    (
        '8jx9hfk3subcytlei39s',
        '10',
        'income',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '7/5/2024, 4:41:23 PM',
        NULL,
        '2849708795244879',
        NULL,
        'v9injjyauq7shgpbwohe'
    ),
    (
        '9hhofp93rrib3s7z1qf5',
        '-10',
        'withdrawal',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '6/30/2024, 11:00:00 AM',
        '1234123412341234',
        NULL,
        NULL,
        NULL
    ),
    (
        'bc44ezgqunl361dhdxvu',
        '10',
        'deposit',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '7/2/2024, 1:22:19 PM',
        '1234123412341234',
        NULL,
        NULL,
        NULL
    ),
    (
        'cqr0csngfaau0b7zyv6s',
        '10',
        'deposit',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '7/1/2024, 3:54:39 PM',
        '1234123412341234',
        NULL,
        NULL,
        NULL
    ),
    (
        'io1dfyex0z6z86yadfs7',
        '10',
        'deposit',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '6/30/2024, 11:00:00 AM',
        '1234123412341235',
        NULL,
        NULL,
        NULL
    ),
    (
        'j58ltcucghn005idxb71',
        '10',
        'deposit',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '7/1/2024, 3:45:52 PM',
        '1234123412341234',
        NULL,
        NULL,
        NULL
    ),
    (
        'jvx41pm9jqj4aaoyfwxs',
        '-10',
        'payment',
        'k7oilq4nabo6d58pbo1y',
        'Success',
        '7/5/2024, 4:41:23 PM',
        NULL,
        '2812405724785337',
        NULL,
        'v9injjyauq7shgpbwohe'
    ),
    (
        'r7t2c26datw6gtyfk1z8',
        '10',
        'deposit',
        'ucya5mn7vz964cw79v5m',
        'Success',
        '6/30/2024, 11:00:00 AM',
        '1234123412341234',
        NULL,
        NULL,
        NULL
    ),
    (
        'rc515ulnejwpt2bjmmls',
        '1000',
        'deposit',
        '3p1ckdk20tsr5nhozu45',
        'Success',
        '9/5/2024, 4:12:22 PM',
        '2849708795244879',
        NULL,
        NULL,
        NULL
    ),
    (
        'tawc7kvk5duupoq0jkr7',
        '-10',
        'payment',
        '3p1ckdk20tsr5nhozu45',
        'Revert',
        '9/5/2024, 4:13:19 PM',
        NULL,
        '2849708795244879',
        NULL,
        '8dem7ap68z1yo9nlo9rq'
    ),
    (
        'tl5rbw8v75xm2ntuymkj',
        '10',
        'income',
        'k7oilq4nabo6d58pbo1y',
        'Revert',
        '9/5/2024, 4:13:19 PM',
        NULL,
        '4798811485900948',
        NULL,
        '8dem7ap68z1yo9nlo9rq'
    );

-- Insert mock data to transaction table
INSERT INTO
    transactions(id, reciever_id, sender_id, amount, status)
VALUES
    (
        '8dem7ap68z1yo9nlo9rq',
        'tl5rbw8v75xm2ntuymkj',
        'tawc7kvk5duupoq0jkr7',
        '10',
        'Revert'
    ),
    (
        'v9injjyauq7shgpbwohe',
        '8jx9hfk3subcytlei39s',
        'jvx41pm9jqj4aaoyfwxs',
        '10',
        'Success'
    );

INSERT INTO
    chat(
        chat_id,
        user1_id,
        user2_id,
        last_message_id,
        wallet_1,
        wallet_2
    )
VALUES
    (
        'fclxkngk5xi6oysbjfso',
        '3p1ckdk20tsr5nhozu45',
        'k7oilq4nabo6d58pbo1y',
        'bw8h3cj6okkp0f2sarxi',
        '4798811485900948',
        '2849708795244879'
    );

INSERT INTO
    messages(
        message_id,
        text,
        send_date,
        chat_id,
        sender_id
    )
VALUES
    (
        '2cdr2tdydyjem3ndoea2',
        'Hi',
        '9/10/2024, 1:09:06 PM',
        'fclxkngk5xi6oysbjfso',
        'k7oilq4nabo6d58pbo1y'
    ),
    (
        'bw8h3cj6okkp0f2sarxi',
        'What`s up',
        '9/10/2024, 1:09:14 PM',
        'fclxkngk5xi6oysbjfso',
        '3p1ckdk20tsr5nhozu45'
    );