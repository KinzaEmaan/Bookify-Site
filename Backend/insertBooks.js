import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPath = './database.sqlite';

const insertBooks = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const books = [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A novel about the serious issues of rape and racial inequality.',
        file_path: '/books/to_kill_a_mockingbird.pdf',
        image_path: '/images/to_kill_a_mockingbird.jpg',
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel set in a totalitarian society under constant surveillance.',
        file_path: '/books/1984.pdf',
        image_path: '/images/1984.jpg',
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A romantic novel that also critiques the British landed gentry at the end of the 18th century.',
        file_path: '/books/pride_and_prejudice.pdf',
        image_path: '/images/pride_and_prejudice.jpg',
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A novel about the American dream and the roaring twenties.',
        file_path: '/books/the_great_gatsby.pdf',
        image_path: '/images/the_great_gatsby.jpg',
      },
      {
        title: 'Moby Dick',
        author: 'Herman Melville',
        description: 'A novel about the voyage of the whaling ship Pequod.',
        file_path: '/books/moby_dick.pdf',
        image_path: '/images/moby_dick.jpg',
      },
      {
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        description: 'A novel that chronicles the history of the French invasion of Russia.',
        file_path: '/books/war_and_peace.pdf',
        image_path: '/images/war_and_peace.jpg',
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'A novel about the events and circumstances that occur to a teenager in New York City.',
        file_path: '/books/the_catcher_in_the_rye.pdf',
        image_path: '/images/the_catcher_in_the_rye.jpg',
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'A fantasy novel that sets the stage for the Lord of the Rings trilogy.',
        file_path: '/books/the_hobbit.pdf',
        image_path: '/images/the_hobbit.jpg',
      },
      {
        title: 'Ulysses',
        author: 'James Joyce',
        description: 'A modernist novel that chronicles the experiences of Leopold Bloom in Dublin.',
        file_path: '/books/ulysses.pdf',
        image_path: '/images/ulysses.jpg',
      },
      {
        title: 'The Brothers Karamazov',
        author: 'Fyodor Dostoevsky',
        description: 'A philosophical novel that enters deeply into the ethical debates of God, free will, and morality.',
        file_path: '/books/the_brothers_karamazov.pdf',
        image_path: '/images/the_brothers_karamazov.jpg',
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        description: 'A dystopian novel that anticipates huge scientific developments in reproductive technology.',
        file_path: '/books/brave_new_world.pdf',
        image_path: '/images/brave_new_world.jpg',
      },
      {
        title: 'The Iliad',
        author: 'Homer',
        description: 'An ancient Greek epic poem set during the Trojan War.',
        file_path: '/books/the_iliad.pdf',
        image_path: '/images/the_iliad.jpg',
      },
      {
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        description: 'A novel about the mental anguish and moral dilemmas of an impoverished ex-student.',
        file_path: '/books/crime_and_punishment.pdf',
        image_path: '/images/crime_and_punishment.jpg',
      },
      {
        title: 'The Odyssey',
        author: 'Homer',
        description: 'An epic poem that is one of two major ancient Greek epic poems attributed to Homer.',
        file_path: '/books/the_odyssey.pdf',
        image_path: '/images/the_odyssey.jpg',
      },
      {
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel Garcia Marquez',
        description: 'A multi-generational story of the Buendía family.',
        file_path: '/books/one_hundred_years_of_solitude.pdf',
        image_path: '/images/one_hundred_years_of_solitude.jpg',
      },
      {
        title: 'Madame Bovary',
        author: 'Gustave Flaubert',
        description: 'A novel about a doctor\'s wife who has adulterous affairs and lives beyond her means.',
        file_path: '/books/madame_bovary.pdf',
        image_path: '/images/madame_bovary.jpg',
      },
      {
        title: 'The Divine Comedy',
        author: 'Dante Alighieri',
        description: 'An epic poem that describes Dante\'s travels through Hell, Purgatory, and Paradise.',
        file_path: '/books/the_divine_comedy.pdf',
        image_path: '/images/the_divine_comedy.jpg',
      },
      {
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        description: 'A novel that follows the experiences of its eponymous heroine, including her growth to adulthood.',
        file_path: '/books/jane_eyre.pdf',
        image_path: '/images/jane_eyre.jpg',
      },
      {
        title: 'Wuthering Heights',
        author: 'Emily Brontë',
        description: 'A novel about the intense and almost demonic love between Catherine Earnshaw and Heathcliff.',
        file_path: '/books/wuthering_heights.pdf',
        image_path: '/images/wuthering_heights.jpg',
      },
    ];

    for (const book of books) {
      await db.run(
        'INSERT INTO books (title, author, description, file_path, image_path) VALUES (?, ?, ?, ?, ?)',
        [book.title, book.author, book.description, book.file_path, book.image_path]
      );
    }

    console.log('Books inserted successfully.');
  } catch (error) {
    console.error('Error inserting books:', error);
  }
};

insertBooks();
