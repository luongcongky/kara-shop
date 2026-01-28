import { getCloudinaryUrl } from '@/utils/cloudinary';
import { Prisma } from '@prisma/client';

export const products: Prisma.ProductCreateInput[] = [
  {
    name: 'Black shirt with white border',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 35.0,
    rate: 4.2,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['BLACK'],
    collections: { create: { collectionId: 29 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-1.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAUGB//EACQQAAICAQIHAAMAAAAAAAAAAAECAwQRAAUGBxMUITFRQXGh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ACuPuae9bTxxarbVPCu37VJ05a7Qhu5IUGTLexjJAxj1+dbVTkS5UhtV3DQzosiH6pGR/DqPm5Y8Kz7j39qnPPaMxnZ2sMA7Fy3kDAPk4/QA09o7FBRpQVK1q4sNeNYo16o8KowB6+DQf//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-2.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwX/xAAjEAABAgUEAwEAAAAAAAAAAAABAgMABAURIQYHEjETQVFx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABYRAQEBAAAAAAAAAAAAAAAAAAARIf/aAAwDAQACEQMRAD8Aobj61YG5tHpy5flLUWbbU64lwhZccKRcDqyRjOe+oZVGxI+Qa6226kqxrNiqNTSpEvFsTCGWhd08iFK5XwSmwvb1CY2fG2lCMJSAkfghC4//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-3.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQUGB//EACIQAAIBAwQCAwAAAAAAAAAAAAECBAAGEQMFITESEyJhkf/EABUBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ADdUmPAuuLJZVd19eo7BsFAp5HHPVU63Ds7KGG5RsEZGXwfyiG2M7utybnnsQD4vgZ+lFK0laoRfkeqUv//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-4.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAjEAACAQIGAgMAAAAAAAAAAAABAgMEEQAFBhIhMQdBYXGB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALzylWakpKrIX05TCWOOrEtQ1gxPIRUtfoh2J+sXLXDEDoHBUk0kueNEdgjgaADg3O4OTzf4X16P4tgP/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Funnel collar puffer jacket',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 87.95,
    rate: 4.5,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['GREEN', 'PINK'],
    collections: { create: { collectionId: 29 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-5.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgMEBv/EACEQAQABAwIHAAAAAAAAAAAAAAERAAIDEjEEEyEyUWGB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AN1l4vl59IDZb3+flVnUk2pZhxzOi1d5aIstACYPdB//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-6.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQG/8QAHBAAAgMAAwEAAAAAAAAAAAAAAQIAAxETIZEi/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A2ljjmU94h92PogSWKpuqcj6XM9yNplSP/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-7.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAACAf/xAAgEAACAQQCAwEAAAAAAAAAAAABAgMEBRESAAcGITFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAbEQACAgMBAAAAAAAAAAAAAAABAwACERITIv/aAAwDAQACEQMRAD8Ac9rutp8Gram9yV0xjvFbDFKJXDIC5zhAANB9P565WNA3tRsp9gj4R+8G3Tvds/bPY9D4BePGYYKCZGqp2WrfZzHGcKNQpAJGSMnPzi8WslRQiHVVGAAcADj52V5sMSCWho2Bn//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-8.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABwMI/8QAJRAAAgEDAwMFAQAAAAAAAAAAAQIDBAURABIhBgcTIjEyYXGB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABcRAAMBAAAAAAAAAAAAAAAAAAERIQD/2gAMAwEAAhEDEQA/AN29yO5NHYeoLTb1r3hFFUQ1s/jkZBPGdy7WfIQJjeW3ZHpPAO06R4qymmiSVKiPa6hhlxnB/ui7qvpewXilhrrvaqeqktymeElcMCrCQjP2UUH8HHGqQyPWQx1cbeJJ1Eix/LYGGQM8Zxn3wNCAowG6Zv/Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-9.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBv/EAB8QAQACAgAHAAAAAAAAAAAAAAEAAwIREiEiUVKRof/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAACH/2gAMAwEAAhEDEQA/AN5nelnTrgx2J3lBpBHkxCmvx+wleIaHL3Cx/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Boy’s Jeans Simple',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 42.5,
    rate: 3.9,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 24 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-10.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAJBAAAQIFAgcAAAAAAAAAAAAAAQQFAAIDEjEGERMUITNBUWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ALjWb4+odeNSNuWCk3zBMVNKyU38SsZMkbjG0aAcmDVzC2rl3OKk96gCiBPeR2qhqSdB6mJP3zCUND//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-11.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQf/xAAkEAABAwMBCQAAAAAAAAAAAAABAgMEAAURBhIUISIxQWGBkf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCn6uuBgzLK0ENr3mYENhWclzHKBjwVfKfKRk46UTd4TcufbZCyQqC6X2x2KjhPH0TSW2aQ/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Brown and White Striped T-shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 50.95,
    rate: 4.1,
    published: true,
    types: ['CLOTHES'],
    sizes: ['L', 'XL', 'XXL'],
    colors: ['RED'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-12.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAHxAAAgEFAAMBAAAAAAAAAAAAAREEAAIDBRIhQWGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/ANDstxnhzxHxxRf1zwSV0z5X5VkFhkr4fVBl6nHNlYZN+S+27CkAAii6YqLcf//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-13.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQG/8QAIRAAAQQBAwUAAAAAAAAAAAAAAQACAwQRBRITITFBUWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A189h7NRrQho45GvLj9HZP09ILEDXXa8xJJj3Bo8AkYyqMIP/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-14.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABgcICf/EACYQAAIBAwMEAQUAAAAAAAAAAAECAwQFEQAGCAcSITEUIzJBYZP/xAAVAQEBAAAAAAAAAAAAAAAAAAADBf/EABsRAAEFAQEAAAAAAAAAAAAAAAEAAgNRYRIT/9oADAMBAAIRAxEAPwC2+QO6tobV2Vb23JPcGlqLjHLRRUkrRtNLB9QhmDLhcfv2QcHGlJJzxtwkYP0uYNk5xdRjP89G3L0UsPH2/wB7qaRKiWzyUtXTlgO5HM6RntYg9pKuRkfjxrM+bqXDHM8bWAsVYgt8oeTn39mh4eXksxUYTB4gS2byl//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-15.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA8KCw0LCQ8NDA0REA8SFyYYFxUVFy4hIxsmNzA5ODYwNTQ8RFZJPEBSQTQ1S2ZMUllcYWJhOkhqcmlecVZfYV3/2wBDARARERcUFywYGCxdPjU+XV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV3/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgP/xAAfEAACAgIBBQAAAAAAAAAAAAABAwIRAAQGEiEiUZH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwBtsbyUOWqbFxMj3EpUQPf3L2MG8p2Ir5DqpKxIMjDqN1fkRi4miRgbj//Z',
          },
        ],
      },
    },
  },
  {
    name: 'Black Shoes Fashionable',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 74.3,
    rate: 3.8,
    published: true,
    types: ['CLOTHES'],
    sizes: ['L', 'XL', 'XXL'],
    colors: ['BLACK'],
    collections: { create: { collectionId: 10 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-16.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQoJBwwKCgoNDQwOEh4TEhAQEiQaGxUeKyYtLComKSkvNUQ6LzJAMykpO1E8QEZJTE1MLjlUWlNKWURLTEn/2wBDAQ0NDRIQEiMTEyNJMSkxSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUn/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwb/xAAjEAACAQIEBwAAAAAAAAAAAAABAgMABAUSMUEGESEiI2Fx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKS846wmyx+XCZ47hHifLJMQMi+9eZGm1UyeSNXTuVgCCNxRyW8Ejq8kETuvVWZASPhpaD//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-17.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgwKCA0MCwwPDg0QFCIWFBISFCkdHxgiMSszMjArLy42PE1CNjlJOi4vQ1xESVBSV1dXNEFfZl5UZU1VV1P/2wBDAQ4PDxQSFCcWFidTNy83U1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1P/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwQFBv/EACEQAAEEAgICAwAAAAAAAAAAAAECAwQFABESMRMhUWGh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANBd3tlXy1LartV0dQDzzx4qd+mxv9PwcpQ7CXJhsPmvcSXW0r4762N6wgqIig8H0Kkh57zKEhXMBXQ0D6AAx/A//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-18.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIxAAAQIFAwUAAAAAAAAAAAAAAQIDAAQFETESEyEGIkFxof/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AvqzZmeuKayoXaDWpSVYVbUcewPkamAOnZRU3UGCHtrYSVoUlPcCTzzfBAItbzCJzEH//2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Brown Cowboy Boots',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 95.5,
    rate: 4.7,
    published: true,
    types: ['CLOTHES'],
    sizes: ['L', 'XL', 'XXL'],
    colors: ['ORANGE'],
    collections: { create: { collectionId: 10 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-19.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQoJBwwKCgoNDQwOEh4TEhAQEiQaGxUeKyYtLComKSkvNUQ6LzJAMykpO1E8QEZJTE1MLjlUWlNKWURLTEn/2wBDAQ0NDRIQEiMTEyNJMSkxSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUn/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQIH/8QAIxAAAgIBAwMFAAAAAAAAAAAAAQIDEQQAEkEFBjETFDJRcf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAIf/aAAwDAQACEQMRAD8A0abJx4K9aeKK/G9wt8c6tJEdFdHVlYWGBsEaH6h2xhdSyPcTSz7xe633WDwL+I/NKRYsEMSRRxKqIoVR9AeNFMf/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-20.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHCAkIBgoJCAkMCwoMDxoRDw4ODx8WGBMaJSEnJiQhJCMpLjsyKSw4LCMkM0Y0OD0/QkNCKDFITUhATTtBQj//2wBDAQsMDA8NDx4RER4/KiQqPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz//wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQH/8QAIRAAAgIBBAIDAAAAAAAAAAAAAQMCBAAFERIhBjETI2H/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAFBERL/2gAMAwEAAhEDEQA/ANAd5JQhKz8XN8apIfJe317e9we+sTTaW9C3LDDBkRKJ4H0exkDvH6zdUjqNZjalodzkkgcx+jbFsK2ifMP/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-21.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBggGBQkIBwgKCQkKDRYODQwMDRoTFBAWHxwhIB8cHh4jJzIqIyUvJR4eKzssLzM1ODg4ISo9QTw2QTI3ODX/2wBDAQkKCg0LDRkODhk1JB4kNTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTX/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgME/8QAIxAAAgEEAQMFAAAAAAAAAAAAAQIDAAQFEQYSMUEHFCEigf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAXEQEBAQEAAAAAAAAAAAAAAAABADER/9oADAMBAAIRAxEAPwB7ms/JbTRXnuJEw8MihpLKI3Elw+t9Gl30qPO6gPU3DkbFpmSD2Ix0lYeUSypzfGcfxcr4xcypku7q2JEhVCfqvhSdfLd6eh2CgBj+ndAc2VHL/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-22.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAb/xAAfEAACAgICAwEAAAAAAAAAAAABAwIEACERMQUiQWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AtX2Eq8hWVOYDnAhceT7DuX58GLwliuGW67jLaTrXfJxW8D//2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Cotton T-shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 9.9,
    rate: 2.9,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L'],
    colors: ['ORANGE'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-23.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAALAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwYH/8QAIBAAAQMEAwEBAAAAAAAAAAAAAwECEQAEBTESIkETUf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQIAMf/aAAwDAQACEQMRAD8A03M5DJ22bbbguBtGTh828JSFWO3u/wAqlTXbfsaoiWVqYqGKAbytiHq2VSNUtGZRVdS7mgA5v//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-24.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgYH/8QAHxAAAgEEAwEBAAAAAAAAAAAAAQIDAAQRIQUSQROB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/ANK5u75GHnkt4b4okvTooGlBONj3dVA0AG2fSNZoG3hd/o8MbOMYYqCR+06CDCey1jAqoyf/2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Denim shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 15,
    rate: 3.5,
    published: true,
    types: ['CLOTHES'],
    sizes: ['L', 'XL', 'XXL', 'XXXL'],
    colors: ['GRAY'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-25.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQG/8QAGhAAAwEBAQEAAAAAAAAAAAAAAQIRAwAxUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDY7bNnoVAWCe9RBwE+KaOHa0Tw/DeS8H//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-26.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHCAkIBgoJCAkMCwoMDxoRDw4ODx8WGBMaJSEnJiQhJCMpLjsyKSw4LCMkM0Y0OD0/QkNCKDFITUhATTtBQj//2wBDAQsMDA8NDx4RER4/KiQqPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz//wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIhAAAQQBAwUBAAAAAAAAAAAAAQIDBBEABRMhBhIVMlGB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANGnTI8TWoSX5DDK5ILTSV+zvNlI/axTjJ/qDa8poJcYbcUqbthSxZQO0qsfDaE47ZwL/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-27.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAACAf/xAAjEAACAQMDBQEBAAAAAAAAAAABAwIEBREGByEAEhMiMQhx/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABsRAAIBBQAAAAAAAAAAAAAAAAECAAMhQZHw/9oADAMBAAIRAxEAPwBeU+p3WbcSsuqZQZO5INRUrp1kMqp0rfEyHAxPtWxYiPuY8fc9XEcgEYIPI56HX6U3X1btrvrozb7SsbYqF9hbrq24OpPJUKW6/JpG08PYRAktuO/Hd6/whhsJiyUYnABIA6OmpUX453FqsGNuGNT/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-28.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA8KCw0LCQ8NDA0REA8SFyYYFxUVFy4hIxsmNzA5ODYwNTQ8RFZJPEBSQTQ1S2ZMUllcYWJhOkhqcmlecVZfYV3/2wBDARARERcUFywYGCxdPjU+XV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV3/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgQG/8QAIRAAAQQCAAcAAAAAAAAAAAAAAQACAxEEEgUhMVFhcbH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A1+RMY+JYkJjcWyh9SN6MIF0fY+K2kSzZzHbEa2a78qTryg//2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Girl’s Plaid shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 25,
    rate: 3.8,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-29.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgQG/8QAHRAAAgMAAgMAAAAAAAAAAAAAAQIAAxEEEiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/ANjfyWr5CoAOvjd+ynI2YAaqtySyAk+4tgX/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-30.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgT/xAAiEAABAgUEAwAAAAAAAAAAAAABAAIDBBESIQUGEzEjYdH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQEBAQEBAAAAAAAAAAAAAAARAAECA//aAAwDAQACEQMRAD8AXFzDNiLnAs79qpAixWBqUzE3U6UL/BzubZQdAH5VKqrT0wKONW//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-31.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAb/xAAgEAACAgIBBQEAAAAAAAAAAAABAgMRAAQSISIxMkFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8ArNncTWmDzzrDrr2tyHsT46/MbjLDYLPowyyq7hm4kHixtSbu6/cVVY0f/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Girls’ gathered-sleeve top',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 18,
    rate: 4.1,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['PINK'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-32.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAQAG/8QAGBABAQEBAQAAAAAAAAAAAAAAAQACEVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A2+lNAHSeS+1B/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-33.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAYHCP/EACIQAAICAQMEAwAAAAAAAAAAAAECAwUEABEhBgcTMjFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAT/xAAaEQADAAMBAAAAAAAAAAAAAAABAgMAEXHR/9oADAMBAAIRAxEAPwDUPd+67idC9x6HqygxMu0r7C/qqqXBxs2QrFHK+UMiSWABtldfAoIHJUE+g1c4Mq9eGN5qBYpGUFo2ylJQ7cg8fWhjiV1mcZrDAjnIzl8bN7RyIxZXB+eGTfb90xaLKLKWIY6PPMXaysqgqNgZ/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-34.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASEAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAhEAACAQMEAwEAAAAAAAAAAAABAwIABAUREiFhIjEycf/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/EABgRAQEBAQEAAAAAAAAAAAAAAAEAMQIR/9oADAMBAAIRAxEAPwCnyi7xjLc2tyUKgwFm36lz6/Ou6RJ5oNlynMvmXWmet8fBS5KYVyMjru8pEHSn9ai10eBf/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Girls’ mixed-stripe shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 35,
    rate: 3.9,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-35.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAQj/xAAjEAABAwMEAgMAAAAAAAAAAAABAgMEBREhAAYHEggTMTOB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAXEQEAAwAAAAAAAAAAAAAAAAABAAIR/9oADAMBAAIRAxEAPwCl+avIHmDZnNjewtsxqezGkKhIpsOS0ytVR9hsVdyboDi+zYyLdQcXvqqWbONIcdJYWpIUppQuWyRlJIwSPjGg0mlSyJ0qmRHpLP1vOMpUtFsiyiLj806pewgBkIYs/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-36.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAjEAACAQIGAgMAAAAAAAAAAAABAgMEEQAFBgcSIQgxExUy/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAXEQEBAQEAAAAAAAAAAAAAAAABAgAR/9oADAMBAAIRAxEAPwCld7PIbdvQ+9KaF05SUKUs0lDHl9DNDC8mYCRgGfmTdA7ckFyLcQer3xVcVpIkkkb4HZQWicXaMkdqSOiR66w+oymqYV1VllJNUx/iaSFWdberMRcYYpdFABzEOLv/2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Girls’ slide sneakers',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 22,
    rate: 4.2,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 7 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-37.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAALAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAHBAAAgIDAQEAAAAAAAAAAAAAAQMAAgQFEUGR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANoydmxGwXi11me+tyAXrXUrp30k278EoRED/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-38.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAHRAAAQQDAQEAAAAAAAAAAAAAAQACAwQRIUEFUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDZrluzF7dCtEwmvMHmVwAwMDWe8592qSIg/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Girls’ slide sneakers in emojis',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 27,
    rate: 4.1,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['YELLOW'],
    collections: { create: { collectionId: 7 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-39.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAAMAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgQH/8QAIBAAAgICAAcAAAAAAAAAAAAAAhEAAQQSAwUhIzFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAXEQEAAwAAAAAAAAAAAAAAAAAAARFB/9oADAMBAAIRAxEAPwDai5tijmni9yz4YbkVBdjXVJ/X6l0OgN6i/LUUIvS//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-40.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAAMAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwUH/8QAIBAAAgEEAgMBAAAAAAAAAAAAAQIDAAQREgUxISJhof/EABUBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARQf/aAAwDAQACEQMRAD8A2G85g23Jm1ZoVXZB7bbYPf7gD7Vehe0tpJhK8EbSDBDFcnx1TVIPZcv/2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Girls’ star-print jeans',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 34,
    rate: 4.6,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 24 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-41.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAALAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIRAAAQQBAwUAAAAAAAAAAAAABAECAxEABQYSEyFBUXH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFREBAQAAAAAAAAAAAAAAAAAAAQD/2gAMAwEAAhEDEQA/ANL3EeePvHSh4Dnwiv6aSwpVSK57k9X4rK3DzaYCSQ0sgWOQiKuEjk7t4rySvireIxKIRBFv/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-42.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAALAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAHhAAAQQCAwEAAAAAAAAAAAAAAQIDBBEABQYSIXH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFREBAQAAAAAAAAAAAAAAAAAAAQD/2gAMAwEAAhEDEQA/ANL5DsdjG5rq4seS8iG8Gw62iutlahZv32qytw72sgyZCJciK25IZro4oep6kkV8JJxGJRIgi3//2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Gray jacket',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 67,
    rate: 4.1,
    published: true,
    types: ['CLOTHES'],
    sizes: ['L', 'XL', 'XXL'],
    colors: ['GRAY'],
    collections: { create: { collectionId: 29 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-43.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAf/xAAfEAABBAEFAQAAAAAAAAAAAAACAAEDEQQFEhMhMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALFl6gUOcMQgHGFcrkz29+bfieiz6fjzyHJIxuZ12xu1V5SU3So//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-44.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAACAf/xAAiEAACAQMEAgMAAAAAAAAAAAABAwIEBREABgcSEyEIYbH/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAHREBAAEEAwEAAAAAAAAAAAAAAREAAgMhEpGxwf/aAAwDAQACEQMRAD8Ab+/Ubfq9+Wm+3SgU6exUtuSmlPeUXsXkRiQe8cQxLAiRLIBJxjVForraa2jRWoq4+OoVFsMgg9ZAEfujdynzHS2n5FUvDc9oLqF7jZa1VVwNX1JD1GPtfjPbrGAAzL79aTCJwWha1oXGEYARHXOAB60eO2OSm1+BT52SwGQOtq+1/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-45.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgf/xAAiEAABAwMDBQAAAAAAAAAAAAABAgMEABESBSExBlFhcaH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKjqLrkhvCU2DgbqaCiLHIWG3Pu9IgkKAUrZR3I80GnzpUfrpAacSGTJhsqbKeQ629kb97tp+01Czaiv/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-46.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAb/xAAeEAACAgICAwAAAAAAAAAAAAACAwABBBESIUGh0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3e9QZWOszGjK9gN33fiKhWY4MyVuK75L1r39iIH//2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Green shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 22,
    rate: 4.4,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['GREEN'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-47.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAMAAoDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwj/xAAjEAABAwMEAgMAAAAAAAAAAAABAgMRBAUhAAYHEhMxIkFR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgME/8QAGhEAAwEBAQEAAAAAAAAAAAAAAAECEQMSIf/aAAwDAQACEQMRAD8AaeTOf7lsrlFmw0zNEqz0ngFYXEErV5IK8g46pIiPuZnWTp3c35HM6tKGHyHZA7JOQf0a0gDu+cD7G3Vd6y83S1vPV9avu8tNW6gKVETAVAwB61F8Yp60JU0ILCjTMtsNk+NpIQmcmAIGT79aqnnwJ//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-48.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwj/xAAiEAACAgICAgIDAAAAAAAAAAABAgMEBREGEgAIEyEHIkL/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBf/EACERAAEDAwQDAAAAAAAAAAAAAAECAxEABBIFITFBExRR/9oADAMBAAIRAxEAPwB3Ps3b4X7o8h4TkcTiKvGstbTF5K2JHe3G9erF8Nptt1SIGTq2l1rsf4PliM6KxVlIIOiNeSP+XeC8YpeydXlmOwlCLLS0q2UtWnhLvOGWetNDrsFCyoV7khj+g69Ts+MlbFZOavFLXzPwROiskQhLdFI+l2X2dD62fIj+pepcG2aSVqjI7xEkjvncU5u2L6PKs4jgdzAHyv/Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-49.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwQFBv/EACAQAAICAQMFAAAAAAAAAAAAAAECAAMRBAUhBhIxcbH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A12rttXqPbwEY0tTapYE4DcH4JU7hFraw2qpc+aw2B74hcwP/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-50.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABwYI/8QAJBAAAgIBAwQCAwAAAAAAAAAAAQIDBBEFEiEABgcIIjEyQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABwRAQABBAMAAAAAAAAAAAAAAAEDAAIREiGRsf/aAAwDAQACEQMRAD8Adfb/ANgO/tL8rdneLPGdSNrVaxUuz25FlEEV6wzRV45pUYBFCurENnJdTgkDrYqXq6oq2mKzAASCMZQN+9uecZ+s9H/cWgU01ttSjSNH1KeOSyghXbK8EeIWfP5Fdq4PB+I/gxUG9uOTAnPPUcDJdLJscCB1nxKaTXS0K//Z',
          },
        ],
      },
    },
  },
  {
    name: 'Green striped jackets',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 42,
    rate: 4.7,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 25 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-51.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIRAAAgEEAgIDAAAAAAAAAAAAAQIDAAQREgUGMVETIWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAECERL/2gAMAwEAAhEDEQA/ANF7H3Wbiudeygt4ZIINPlZidsn7YDH5Vmg3QOmCrDIPsUNedV4W9unuLiyDSyNs5DsNj7IzS8SLDEkUQ0RFCqo8ADwKVOcWAlUm+j//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-52.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwb/xAAkEAACAAUEAQUAAAAAAAAAAAABAgADERIxBAUhUTIGEyIjYf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQACAwEAAAAAAAAAAAAAAAACAwAxQTL/2gAMAwEAAhEDEQA/AECduuyr6lO5X6j3Jf0mYDVWoCtoFfE1JI7Wv7FfaOoBdGzFFkKxCtOQPz5BjgdDjAzxXEPV1nwGF4hDWK62EtpM6yf/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-53.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQf/xAAkEAABAwMBCQAAAAAAAAAAAAABAgMEAAURBhIUISIxQWGBkf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCn6uuBgzLK0ENr3mYENhWclzHKBjwVfKfKRk46UTd4TcufbZCyQqC6X2x2KjhPH0TSW2aQ/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Gril’s Fashion coats',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 65,
    rate: 4.1,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L'],
    colors: ['BLUE'],
    collections: { create: { collectionId: 29 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-54.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIxAAAgAFBAIDAAAAAAAAAAAAAQIAAwQFMQYHESESEyJBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8At7gbu1em9eJaaSnp5tvpDLWtZgSzFuCwB5+PipB++8xriH2IryuHRgCrA9EHBg1etv8ATF6u6XO42xZtUrByVmMquwwWUHhj+kjvBhKiiWipLARFACqvQAGABFH/2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-55.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgf/xAAmEAACAgECAwkAAAAAAAAAAAABAgMEBQARBgchEzEyQmJykaLR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQEBAQEAAAAAAAAAAAAAAAABEQAC/9oADAMBAAIRAxEAPwB7xdnK2Num009ns8Mkc9xIfCqSNsNx5iQD0/dKKzJarxWK7rJDMgkRwejKRuD8agXMPKTk8wY9+kuSpVz7FD7D6DS7hXJWl4YxKiVthShHf6BoOZXUtA3/2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Gril’s Short T-shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 39,
    rate: 4.0,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L'],
    colors: ['BLUE', 'PINK', 'YELLOW'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-56.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAfEAABBQADAAMAAAAAAAAAAAABAgMEBREABiESE2H/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAEAQf/aAAwDAQACEQMRAD8AvO398saHuESkjVLMlMoMlC1PlKl/NRSc8wYRnvLw+Ejh82jqp1gzPmV0Z+Wxn1PONgrRh0Yfw+8Q5SmQX//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-57.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwb/xAAiEAABAwMEAwEAAAAAAAAAAAABAgMEABESBQcTIQYiMfH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABwRAAAGAwAAAAAAAAAAAAAAAAABAhESIVFhkf/aAAwDAQACEQMRAD8AonfNUxNyFw5EhXAuYmJiVHFtvApHXztwg0lEAGxoC1ZSWd6vRtOJ1JJxIuLm37TvyGgkQJs2LWqVtrg//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-58.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAHxAAAQQCAgMAAAAAAAAAAAAAAwECBBEABRKBBiFB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAaEQEBAAMBAQAAAAAAAAAAAAABAgADETFh/9oADAMBAAIRAxEAPwDWN35BK124DCFDGVpeHFVeqK61rrvKD7hpGvhyZA5B4wyGHXB7k9tpbTE4JKF65bZWupkg4nv3P//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-59.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgQH/8QAGxAAAgMAAwAAAAAAAAAAAAAAAQIAAxEEMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAEAAhH/2gAMAwEAAhEDEQA/ANwu5DV2hAgO57KIHqR2DMoJHRjkZEXrN//Z',
          },
        ],
      },
    },
  },
  {
    name: 'Guide Pack Cap',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 20,
    rate: 3.9,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['GRAY'],
    collections: { create: { collectionId: 42 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-60.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAHhAAAgICAgMAAAAAAAAAAAAAAQIABAMiBRExMoH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A1/k79ytnRKlHJnU+zBCfkppsisdSR2QfIiIh/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-61.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQACAwQFBhEiQVFxgf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDRr5kV2oshZQUloq54XDYmjgLo/rvfhVjOTGuPEkbIPSbRIf/Z',
          },
        ],
      },
    },
  },
  {
    name: 'High sport shoes',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 135,
    rate: 4.3,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['GRAY'],
    collections: { create: { collectionId: 7 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-62.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA8KCw0LCQ8NDA0REA8SFyYYFxUVFy4hIxsmNzA5ODYwNTQ8RFZJPEBSQTQ1S2ZMUllcYWJhOkhqcmlecVZfYV3/2wBDARARERcUFywYGCxdPjU+XV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV3/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgUG/8QAHhAAAgEEAwEAAAAAAAAAAAAAAQIAAwQhMQURIhT/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A1VfnbO35L4axdHx7K+cjvcpbGISilgxUEjRI1FA//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-63.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsHCAoIBwsKCQoMDAsNEBsSEA8PECEYGRQbJyMpKScjJiUsMT81LC47LyUmNko3O0FDRkdGKjRNUkxEUj9FRkP/2wBDAQwMDBAOECASEiBDLSYtQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0P/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwUG/8QAIhAAAwABAgYDAAAAAAAAAAAAAQIDBAARBQYSISIxYZGS/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANhbmloZWTJ+H3ouNktKrR8ik9t1cj5+tXpXlaSVnWbI6hlIYdwfWjlg48s2uZOfTeyhaMCfID120omgGwRfyNB//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-64.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQcI/8QAIxAAAgICAQQCAwAAAAAAAAAAAQIDBAYRBQAHCBITITFBQv/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/AHs67x+Xi5Ic4mpXMUxnmeUglgrSMIFsQV0IESKw+YxgN7Ow9Q517EjS9GTd+vMa3NJaoZpzZqzMZICmPQuvxk7XTCPRGtff762b3A8dcY7mZouX5Nz3MPFHBHA3HxTBY2Rf5DEEoD9lgutk73v76qFKpU42nBx1CrDBWqxLDDEkYCxxqAFUDX4AAHRI/9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Horizontal Striped T-shirt',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 30,
    rate: 4.1,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L'],
    colors: ['GRAY'],
    collections: { create: { collectionId: 22 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-65.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQcI/8QAIhAAAQQABwADAAAAAAAAAAAAAgEDBAUABgcIERIhEzFB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDXesG5W8003Cab6KV+T4FjFz0rPz2D0l0HYveSTRdAEVE+BHt6v77wnuL7g+Zl6hsbitzDPpoUi0pkfSumOsiT0RHhQXUbNfR7iiIXH2iYQxA//9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-66.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQoJBwwKCgoNDQwOEh4TEhAQEiQaGxUeKyYtLComKSkvNUQ6LzJAMykpO1E8QEZJTE1MLjlUWlNKWURLTEn/2wBDAQ0NDRIQEiMTEyNJMSkxSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUn/wAARCAANAAoDASEAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgX/xAAhEAABBAEDBQAAAAAAAAAAAAABAgMEEQAFEiEGImGBwf/EABQBAQAAAAAAAAAAAAAAAAAAAAL/xAAXEQEBAQEAAAAAAAAAAAAAAAABABEh/9oADAMBAAIRAxEAPwBxM1NmPrUSIqY22twcsqNFd2BQrk+8qYR3ZJwhmqITI6+grWO5nalJB8X9OMN2JMiOl//Z',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-67.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQf/xAAiEAABAgUEAwAAAAAAAAAAAAABAhEAAwQFIRITMUEGIlH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABURAQEAAAAAAAAAAAAAAAAAAAAh/9oADAMBAAIRAxEAPwCuV9bPk+QWimQkGRUbwmHUQxCHTjvjviF4BuYa/Wua51I3AA+MsDj77Q1qMTC//9k=',
          },
        ],
      },
    },
  },
  {
    name: 'Jacket Collar',
    description: `Go sporty this summer with this vintage navy and white striped v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing with denim and white kicks for a stylish sporty vibe. Will fit a UK 8-10, model shown is a UK 8 and 5.`,
    price: 45,
    rate: 4.2,
    published: true,
    types: ['CLOTHES'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['RED', 'PINK', 'GRAY'],
    collections: { create: { collectionId: 29 } },
    images: {
      createMany: {
        data: [
          {
            imageURL: getCloudinaryUrl('/assets/products/product-68.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABgf/xAAkEAACAAYCAAcAAAAAAAAAAAABAgADBAURIQYSBxMUIkFRYv/EABUBAQEAAAAAAAAAAAAAAAAAAAIE/8QAHREAAgIBBQAAAAAAAAAAAAAAAQIAEQMEITFhwf/aAAwDAQACEQMRAD8ATc18Tq+w8ze2UtJTTaGkKLPLg937AE4OdYz9GKiFLDK7B2DBm6cAsl1mXObVyFepuT+Z6goC8j2quEOPznfyTCdWKgAaA0ICg2blupfAyIMK0QN++Pbn/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-69.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQcI/8QAJhAAAgICAQIFBQAAAAAAAAAAAQIDBAURBgAHCBITISIUIzFBkf/EABUBAQEAAAAAAAAAAAAAAAAAAAUG/8QAIhEAAQIFBAMAAAAAAAAAAAAAAQIRAAMEMUEFBhJxocHw/9oADAMBAAIRAxEAPwCrdrfEOnO/FZfq87ioYy3hrOZxEUcbFkghoI30wjY7JZ2kttIAdOwi0B5NHaNe9UtV4rUE6tFMiyI2j7qRsH+dGxhcbRxvcbg3eLkUIy+c5Jm6S5lIkjpwW3tSxwswRFPk+N0bA35vSBbbMW6SP1DD9lNhY/iADoaHt+P10dp6zMCyC45Ht8+oodwmkMyUaVBQ6EuMC9vvLx//2Q==',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-70.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQG/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQACAxEhBBMxQRVxkf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ANfKJvJabbcBCGP3Qe+Kx77VWEDg462Ih1NEbrFc5FZ+pkW1/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-71.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA8KCw0LCQ8NDA0REA8SFyYYFxUVFy4hIxsmNzA5ODYwNTQ8RFZJPEBSQTQ1S2ZMUllcYWJhOkhqcmlecVZfYV3/2wBDARARERcUFywYGCxdPjU+XV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV3/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgQG/8QAGxAAAgMAAwAAAAAAAAAAAAAAAQIAAxFBQlH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANtffZXeiqFKdtlOQtSjFiRpbnyMHBCv/9k=',
          },
          {
            imageURL: getCloudinaryUrl('/assets/products/product-72.jpg'),
            imageBlur:
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAANAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQG/8QAHhAAAgICAgMAAAAAAAAAAAAAAQIAAxExBBIhUZH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3V99ichVRVKDw3yVYhvQr9ydnR9RcwP/2Q==',
          },
        ],
      },
    },
  },
  {
    name: 'Sony ZV-E10 | Máy ảnh Vlog chuyên dụng (Body Only)',
    description: `Nâng tầm nội dung vlog của bạn với <strong>Sony ZV-E10</strong>, chiếc máy ảnh mirrorless được thiết kế tinh chỉnh dành riêng cho những nhà sáng tạo nội dung hiện đại. Kết hợp cảm biến APS-C lớn với tính linh hoạt của hệ thống ngàm E, ZV-E10 mang lại hình ảnh chất lượng cao, độ sắc nét vượt trội và khả năng kiểm soát sáng tạo tối đa.<h3>Các tính năng nổi bật:</h3><ul><li><strong>Cảm biến APS-C Exmor CMOS 24.2MP:</strong> Mang lại hình ảnh chi tiết và dải tương phản động rộng ngay cả trong điều kiện ánh sáng yếu.</li><li><strong>Lấy nét tự động cực nhanh:</strong> Hệ thống Fast Hybrid AF với 425 điểm lấy nét theo pha, cùng tính năng Real-time Eye AF giúp chủ thể luôn sắc nét trong mọi tình huống.</li><li><strong>Chụp ảnh và quay video 4K UHD:</strong> Hỗ trợ quay video 100Mbps chất lượng cao, cho ra những thước phim chuyên nghiệp nhất.</li><li><strong>Âm thanh chất lượng cao:</strong> Tích hợp micro 3 đầu nang hướng định (directional 3-capsule mic) kèm mút chống gió, cho âm thanh trong trẻo ngay cả khi quay ngoài trời.</li></ul><div class="my-8"><img src="https://res.cloudinary.com/dibypjlfc/image/upload/v1769431608/zv-e10_2_y5vit6.webp" alt="Sony ZV-E10 Lifestyle" class="rounded-2xl shadow-lg w-full object-cover h-96" /><p class="text-center text-sm italic text-gray-500 mt-2">Thiết kế nhỏ gọn, tối ưu cho khả năng linh động khi di chuyển.</p></div><h3>Trải nghiệm sáng tạo không giới hạn</h3><p>Dù bạn là một vlogger du lịch, Beauty Guru hay Reviewer công nghệ, Sony ZV-E10 đều đáp ứng hoàn hảo nhu cầu của bạn. Tính năng "Product Showcase Settings" cho phép máy ảnh chuyển tiếp lấy nét mượt mà giữa khuôn mặt bạn và vật thể được đưa ra trước ống kính, cực kỳ hữu dụng cho các video giới thiệu sản phẩm.</p><div class="my-10 aspect-video overflow-hidden rounded-3xl border border-gray-100 shadow-xl bg-black"><iframe class="w-full h-full" src="https://www.youtube.com/embed/P_P_K2pLpAc" title="Sony ZV-E10 Official Introduction" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p>Với màn hình LCD xoay lật đa góc, bạn có thể dễ dàng kiểm soát khung hình khi tự quay. Sony ZV-E10 không chỉ là một chiếc máy ảnh, đó là "cộng sự" đắc lực giúp bạn đưa kênh của mình lên một tầm cao mới.</p>`,
    price: 14190000,
    originalPrice: 15990000,
    rate: 4.8,
    published: true,
    types: ['CAMERA'],
    collections: {
      create: [
        { collectionId: 87 },
        { collectionId: 96 }
      ]
    },
    images: {
      createMany: {
        data: [
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431614/zv-e10_8_kt0shu.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431615/zv-e10_9_qxsydc.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431611/zv-e10_6_oajm9s.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431612/zv-e10_7_q0oevk.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431609/zv-e10_4_njiddr.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431610/zv-e10_5_mhhes0.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431618/zv-e10_1_tptpiw.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431616/zv-e10_10_olimnf.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431608/zv-e10_2_y5vit6.webp", imageBlur: "" },
          { imageURL: "https://res.cloudinary.com/dibypjlfc/image/upload/v1769431608/zv-e10_3_vq2hsy.webp", imageBlur: "" }
        ]
      }
    },
    attributes: {
      createMany: {
        data: [
          { groupName: "Hình ảnh", attributeName: "Ngàm ống kính", attributeValue: "Sony E" },
          { groupName: "Hình ảnh", attributeName: "Loại cảm biến", attributeValue: "APS-C" },
          { groupName: "Hình ảnh", attributeName: "Độ phân giải cảm biến", attributeValue: "Thực tế: 27 Megapixel\nHiệu quả: 26 Megapixel" },
          { groupName: "Hình ảnh", attributeName: "Tỷ lệ Crop", attributeValue: "1.5x" },
          { groupName: "Hình ảnh", attributeName: "Chế độ chống rung ảnh", attributeValue: "Kỹ thuật số (Chỉ video)" },
          { groupName: "Hình ảnh", attributeName: "Kích thước ảnh", attributeValue: "3:2\n26 MP (6192 x 4128)\n13 MP (4384 x 2920)\n6.4 MP (3104 x 2064)" },
          { groupName: "Hình ảnh", attributeName: "Tỉ lệ ảnh", attributeValue: "3:2" },
          { groupName: "Hình ảnh", attributeName: "Định dạng ảnh", attributeValue: "HEIF, JPEG, RAW" },
          { groupName: "Hình ảnh", attributeName: "Độ sâu màu", attributeValue: "14-Bit" },
          { groupName: "Hình ảnh", attributeName: "Độ nhạy sáng ISO", attributeValue: "Ảnh\n100 đến 32.000 ở chế độ thủ công (Mở rộng: 50 đến 102.400)\n100 đến 6400 ở chế độ tự động\n\nVideo\n100 đến 32.000 ở chế độ thủ công\n100 đến 6400 ở chế độ tự động" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Loại màn trập", attributeValue: "Màn trập lăn điện tử" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Tốc độ màn trập", attributeValue: "1/8000 đến 30 giây (Ảnh), 1/8000 đến 1 giây (Movie)" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Phương pháp đo sáng", attributeValue: "Average, Center-Weighted, Highlight Weighted, Multi, Spot" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Chế độ phơi sáng", attributeValue: "Aperture Priority, Auto, Manual, Program, Shutter Priority" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Bù phơi sáng", attributeValue: "-5 đến +5 EV (bước 1/3, 1/2 EV)" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Phạm vi đo sáng", attributeValue: "-3 đến 20 EV" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Cân bằng trắng", attributeValue: "Auto, Daylight, Shade, Cloudy, Incandescent, Fluorescent, Flash, Under Water, Color Temp" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Chụp liên tiếp", attributeValue: "Lên đến 11 khung hình/giây" },
          { groupName: "Ánh sáng & Màn trập", attributeName: "Hẹn giờ chụp", attributeValue: "2/5/10 giây" },
          { groupName: "Quay phim", attributeName: "Chế độ quay video", attributeValue: "4K (XAVC HS/S) up to 60p, FHD up to 120p, 10-Bit 4:2:2" },
          { groupName: "Quay phim", attributeName: "Đầu ra video", attributeValue: "HDMI (3840 x 2160, 1920 x 1080p)" },
          { groupName: "Quay phim", attributeName: "Giới hạn ghi âm", attributeValue: "Không có" },
          { groupName: "Âm thanh", attributeName: "Loại micrô tích hợp", attributeValue: "Stereo (Vị trí: Mặt trên)" },
          { groupName: "Âm thanh", attributeName: "Định dạng âm thanh", attributeValue: "LPCM 2-Channel (16/24-Bit 48 kHz)" },
          { groupName: "Lấy nét", attributeName: "Loại lấy nét", attributeValue: "Lấy nét tự động và thủ công" },
          { groupName: "Lấy nét", attributeName: "Chế độ lấy nét", attributeValue: "AF-A, AF-C, DMF, AF-S" },
          { groupName: "Lấy nét", attributeName: "Điểm lấy nét tự động", attributeValue: "759 điểm lấy nét theo pha" },
          { groupName: "Lấy nét", attributeName: "Độ nhạy lấy nét tự động", attributeValue: "-3 đến +20 EV" },
          { groupName: "Màn hình", attributeName: "Kích thước màn hình", attributeValue: "3.0 inch" },
          { groupName: "Màn hình", attributeName: "Độ phân giải màn hình", attributeValue: "1,036,800 điểm" },
          { groupName: "Màn hình", attributeName: "Đặc tính màn hình", attributeValue: "LCD cảm ứng xoay lật" },
          { groupName: "Lưu trữ & Kết nối", attributeName: "Khe cắm thẻ nhớ", attributeValue: "1 khe: SD/SDHC/SDXC/MS Duo (UHS-I)" },
          { groupName: "Lưu trữ & Kết nối", attributeName: "Kết nối không dây", attributeValue: "Wi-Fi 5 (802.11ac), Bluetooth 4.2" },
          { groupName: "Lưu trữ & Kết nối", attributeName: "Video I/O", attributeValue: "1x Micro-HDMI Output" },
          { groupName: "Lưu trữ & Kết nối", attributeName: "Audio I/O", attributeValue: "1x 3.5 mm TRS Headphone, 1x 3.5 mm TRS Microphone" },
          { groupName: "Lưu trữ & Kết nối", attributeName: "Power I/O", attributeValue: "1x USB-C Input" },
          { groupName: "Lưu trữ & Kết nối", attributeName: "Other I/O ", attributeValue: "1x USB-C (USB 3.2 Gen 1) Data Share with Power" },
          { groupName: "Đèn Flash", attributeName: "Đèn Flash trong", attributeValue: "Không có" },
          { groupName: "Đèn Flash", attributeName: "Chế độ Flash", attributeValue: "Auto, Fill Flash, Off, Rear Sync, Slow Sync" },
          { groupName: "Đèn Flash", attributeName: "Tốc độ đồng bộ đèn", attributeValue: "1/30 giây" },
          { groupName: "Đèn Flash", attributeName: "Bù Flash", attributeValue: "-3 đến +3 EV" },
          { groupName: "Đèn Flash", attributeName: "Hệ thống Flash chuyên dụng", attributeValue: "TTL" },
          { groupName: "Đèn Flash", attributeName: "Kết nối Flash rời", attributeValue: "Intelligent Hot Shoe" },
          { groupName: "Nguồn/Pin", attributeName: "Loại pin", attributeValue: "NP-FW50 Lithium-Ion" },
          { groupName: "Nguồn/Pin", attributeName: "Thời lượng pin", attributeValue: "Khoảng 610 bức ảnh" },
          { groupName: "Vật lý", attributeName: "Kích thước (W x H x D)", attributeValue: "114.3 x 67.5 x 54.2 mm" },
          { groupName: "Vật lý", attributeName: "Trọng lượng", attributeValue: "292 g (Body), 377 g (Pin & Thẻ nhớ)" },
          { groupName: "Ống kính đính kèm (Kit)", attributeName: "Ống kính đi kèm", attributeValue: "16-50mm (Tương đương 24-75mm)" },
          { groupName: "Ống kính đính kèm (Kit)", attributeName: "Khẩu độ ống kính", attributeValue: "F3.5 - 5.6 (Min F22 - 36)" },
          { groupName: "Ống kính đính kèm (Kit)", attributeName: "Góc nhìn ống kính", attributeValue: "83° đến 32°" },
          { groupName: "Ống kính đính kèm (Kit)", attributeName: "Khoảng cách lấy nét tối thiểu", attributeValue: "0,25m" },
          { groupName: "Ống kính đính kèm (Kit)", attributeName: "Cấu tạo thấu kính", attributeValue: "9 thấu kính / 8 nhóm, 7 lá khẩu" },
          { groupName: "Ống kính đính kèm (Kit)", attributeName: "Chống rung ống kính", attributeValue: "Có" }
        ]
      }
    },
    inclusions: {
      createMany: {
        data: [
          { itemName: "Thân máy Sony ZV-E10" },
          { itemName: "Pin sạc NP-FW50" },
          { itemName: "Sách hướng dẫn" },
          { itemName: "Dây đeo vai" },
          { itemName: "Đầu bọc mic chống gió" }
        ]
      }
    }
  },
  {
    name: 'Sony Alpha A7 Mark V (A7M5) Body',
    description: `Sony Alpha A7 Mark V (A7M5) thiết lập một tiêu chuẩn mới cho dòng máy ảnh full-frame đa năng, kết hợp hoàn hảo giữa độ phân giải cao, tốc độ xử lý AI vượt trội và khả năng quay phim chuyên nghiệp. Với cảm biến Exmor RS™ 33.0MP xếp chồng một phần và bộ xử lý BIONZ XR2 tiên tiến, A7M5 là sự lựa chọn tối ưu cho cả nhiếp ảnh gia và nhà làm phim chuyên nghiệp.<h3>Tính năng vượt trội:</h3><ul><li><strong>Cảm biến Exmor RS™ 33.0MP:</strong> Mang lại chất lượng hình ảnh tuyệt vời với dải tương phản động rộng 16 stops và khả năng đọc dữ liệu cực nhanh.</li><li><strong>Hệ thống AI xử lý chuyên dụng:</strong> Cải thiện khả năng nhận diện chủ thể Real-time Recognition AF (người, động vật, chim, côn trùng, xe cộ) với độ chính xác kinh ngạc.</li><li><strong>Quay video 4K 120p:</strong> Hỗ trợ quay video 10bit 4:2:2 All-Intra, quay 4K 60p không crop và lấy mẫu 7K từ toàn cảm biến.</li><li><strong>Chống rung 7.5 stops:</strong> Hệ thống ổn định hình ảnh 5 trục trong thân máy (IBIS) giúp bạn tự tin tác nghiệp trong điều kiện thiếu sáng mà không cần tripod.</li></ul><div class="my-8 bg-black p-4 rounded-2xl"><h4 class="text-white text-center mb-4">Sức mạnh từ Trí tuệ nhân tạo</h4><p class="text-gray-300 text-sm">Bộ xử lý AI mới không chỉ lấy nét nhanh mà còn hiểu được cấu trúc cơ thể người, giúp duy trì lấy nét ngay cả khi chủ thể quay mặt đi hoặc bị che khuất một phần.</p></div><h3>Đẳng cấp chuyên nghiệp trong tầm tay</h3><p>Hệ thống kính ngắm OLED 9.44 triệu điểm ảnh mang lại trải nghiệm quan sát chân thực, cùng màn hình LCD xoay lật đa hướng 3.2 inch linh hoạt cho mọi góc máy độc đáo. Sony A7M5 không chỉ là một chiếc máy ảnh, nó là một công cụ sáng tạo không giới hạn.</p>`,
    price: 68990000,
    originalPrice: 72000000,
    rate: 5.0,
    published: true,
    types: ['CAMERA'],
    collections: {
      create: [
        { collectionId: 87 },
        { collectionId: 96 }
      ]
    },
    images: { createMany: { data: [] } },
    attributes: {
      createMany: {
        data: [
          // Thông số vật lý
          { attributeName: "Loại pin", attributeValue: "NP-FZ100 Lithium-Ion" },
          { attributeName: "Thời lượng pin", attributeValue: "Khoảng 750 lần chụp" },
          { attributeName: "Chất liệu thân máy", attributeValue: "Hợp kim magiê" },
          { attributeName: "Kích thước (W x H x D)", attributeValue: "130,3 x 96,4 x 72,3 mm" },
          { attributeName: "Trọng lượng", attributeValue: "610 g (Chỉ thân máy), 695 g (Có pin, thẻ nhớ)" },
          { attributeName: "Nhiệt độ hoạt động", attributeValue: "0 đến 40°C (32 đến 104°F)" },
          
          // Hình ảnh
          { attributeName: "Ngàm ống kính", attributeValue: "Sony E" },
          { attributeName: "Loại cảm biến", attributeValue: "CMOS xếp chồng một phần 35,9 x 23,9 mm (Full-Frame)" },
          { attributeName: "Độ phân giải cảm biến", attributeValue: "Thực tế: 35,7 Megapixel, Hiệu dụng: 33 Megapixel (7008 x 4672)" },
          { attributeName: "Chế độ chống rung ảnh", attributeValue: "Chuyển đổi cảm biến, 5 trục" },
          { attributeName: "Tỉ lệ ảnh", attributeValue: "1:1, 3:2, 4:3, 16:9" },
          { attributeName: "Định dạng ảnh", attributeValue: "HEIF, JPEG, RAW" },
          { attributeName: "Độ sâu màu", attributeValue: "14-Bit" },

          // Lưu trữ và kết nối
          { attributeName: "Khe cắm thẻ nhớ", attributeValue: "Khe 1: CFexpress Type A/SDXC (UHS-II); Khe 2: SD/SDHC/SDXC (UHS-II)" },
          { attributeName: "Kết nối không dây", attributeValue: "Wi-Fi 6 (802.11ax) / Bluetooth 6.0" },
          { attributeName: "GPS", attributeValue: "Có" },
          { attributeName: "Bộ nhớ trong", attributeValue: "KHÔNG" },
          { attributeName: "Video I/O", attributeValue: "1x HDMI Output" },
          { attributeName: "Audio I/O", attributeValue: "1x 3.5 mm Headphone Output; 1x 3.5 mm Microphone Input" },
          { attributeName: "Power/Other I/O", attributeValue: "1x USB-C Input; 1x USB-C (USB 3.2 Gen 2) Data" },

          // Đèn Flash
          { attributeName: "Đèn Flash trong", attributeValue: "Không có" },
          { attributeName: "Tốc độ đồng bộ đèn", attributeValue: "1/250 giây" },
          { attributeName: "Hệ thống Flash", attributeValue: "TTL, Shoe Mount kết nối Flash rời" },

          // Lấy nét
          { attributeName: "Cơ chế lấy nét", attributeValue: "Lấy nét tự động và thủ công" },
          { attributeName: "Chế độ lấy nét", attributeValue: "Continuous-Servo AF, Manual Focus, Subject Tracking (AI-based)" },
          { attributeName: "Điểm lấy nét", attributeValue: "759 điểm (lấy nét theo pha), 425 điểm (tương phản)" },
          { attributeName: "Độ nhạy AF", attributeValue: "-4 đến +20 EV" },

          // Màn hình & Kính ngắm
          { attributeName: "Màn hình", attributeValue: "3.2 inch LCD, 2.095.104 điểm ảnh, Cảm ứng nghiêng 4 trục" },
          { attributeName: "Kính ngắm", attributeValue: "Electronic (OLED) 0.5 inch, 3.686.400 điểm ảnh, 0.78x" },

          // Quay video
          { attributeName: "Chế độ quay video", attributeValue: "4K 120p, 4K 60p (no crop), 10-bit 4:2:2 All-Intra" },
          { attributeName: "Định dạng âm thanh", attributeValue: "4-Channel 24-Bit 48 kHz LPCM Audio" },

          // Ánh sáng & Màn trập
          { attributeName: "ISO", attributeValue: "100 - 51,200 (mở rộng lên 204,800)" },
          { attributeName: "Tốc độ màn trập", attributeValue: "Điện tử: 1/16000s; Cơ học: 1/8000s" },
          { attributeName: "Chụp liên tiếp", attributeValue: "Lên đến 30 fps (raw up to 95 frames)" }
        ]
      }
    },
    inclusions: {
      createMany: {
        data: [
          { itemName: "Thân máy Sony Alpha A7 Mark V" },
          { itemName: "Pin sạc Lithium-Ion (NP-FZ100)" },
          { itemName: "Bộ sạc AC & Cáp USB-C" },
          { itemName: "Dây đeo vai Sony Alpha" },
          { itemName: "Nắp thân máy & Nắp khe cắm phụ kiện" }
        ]
      }
    }
  }
];

