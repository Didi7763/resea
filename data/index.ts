import { COLORS, icons, images } from "../constants";

export const friends = [
    {
        id: "1",
        name: "Tynisa Obey",
        phoneNumber: "+1-300-400-0135",
        avatar: images.user1,
    },
    {
        id: "2",
        name: "Florencio Dorance",
        phoneNumber: "+1-309-900-0135",
        avatar: images.user2,
    },
    {
        id: "3",
        name: "Chantal Shelburne",
        phoneNumber: "+1-400-100-1009",
        avatar: images.user3,
    },
    {
        id: "4",
        name: "Maryland Winkles",
        phoneNumber: "+1-970-200-4550",
        avatar: images.user4,
    },
    {
        id: "5",
        name: "Rodolfo Goode",
        phoneNumber: "+1-100-200-9800",
        avatar: images.user5,
    },
    {
        id: "6",
        name: "Benny Spanbauer",
        phoneNumber: "+1-780-200-9800",
        avatar: images.user6,
    },
    {
        id: "7",
        name: "Tyra Dillon",
        phoneNumber: "+1-943-230-9899",
        avatar: images.user7,
    },
    {
        id: "8",
        name: "Jamel Eusobio",
        phoneNumber: "+1-900-234-9899",
        avatar: images.user8,
    },
    {
        id: "9",
        name: "Pedro Haurad",
        phoneNumber: "+1-240-234-9899",
        avatar: images.user9
    },
    {
        id: "10",
        name: "Clinton Mcclure",
        phoneNumber: "+1-500-234-4555",
        avatar: images.user10
    },
];

export const faqKeywords = [
    {
        id: "1",
        name: "General"
    },
    {
        id: "2",
        name: "Account"
    },
    {
        id: "3",
        name: "Security"
    },
    {
        id: "4",
        name: "Agent"
    },
    {
        id: "5",
        name: "Payment"
    }
];

export const faqs = [
    {
        question: 'How do I search for properties on the real estate app?',
        answer: 'To search for properties, navigate to the "Property Search" section, enter your criteria such as location, price range, and features, then browse through the listings.',
        type: "General"
    },
    {
        question: 'Can I attend virtual property viewings through this real estate app?',
        answer: 'Yes, you can participate in virtual property viewings through this app. Simply select the "Virtual Viewing" option when scheduling a property viewing.',
        type: "General"
    },
    {
        question: 'What should I do if I need to cancel or reschedule a property viewing?',
        answer: 'To cancel or reschedule a property viewing, go to the "My Viewings" section, locate your viewing appointment, and follow the provided options for making changes to your viewing schedule.',
        type: "Account"
    },
    {
        question: 'How can I find a real estate agent specializing in a specific area?',
        answer: 'Utilize the app’s search feature to discover real estate agents based on their expertise and specialization. Filter results by location or property type to find the most suitable agent for your needs.',
        type: "Agent"
    },
    {
        question: 'Is there a way to get property market insights or real estate advice online?',
        answer: 'Yes, you can request property market insights and real estate advice through virtual consultations with agents. They can provide recommendations and share insights digitally.',
        type: "General"
    },
    {
        question: 'What types of real estate professionals are available on this app?',
        answer: 'Our app connects you with a diverse range of real estate professionals, including agents, brokers, property managers, and more.',
        type: "General"
    },
    {
        question: 'How do I make payments for property bookings or purchases?',
        answer: 'You can securely make payments for property bookings or purchases within the app using various payment methods, such as credit/debit cards or digital wallets.',
        type: "Account"
    },
    {
        question: 'Are my property inquiries and information kept confidential?',
        answer: 'Yes, we prioritize the security and confidentiality of your property inquiries and information. Our app complies with strict privacy and data protection standards.',
        type: "Security"
    },
    {
        question: 'Can I request additional assistance with property financing or legal matters through this app?',
        answer: 'Yes, you can request additional assistance with property financing, legal matters, or property management services. Check the app for the availability and terms of these additional services.',
        type: "General"
    },
    {
        question: 'How can I provide feedback or rate my real estate agent after a property transaction?',
        answer: 'After completing a property transaction, you can provide feedback and rate your real estate agent through the app’s rating and review system to contribute to the improvement of our real estate services.',
        type: "Agent"
    },
    {
        question: 'Is technical support available through this app?',
        answer: 'While we provide real estate services, our app is not for technical support. For technical assistance, please contact our support team through the designated channels provided in the app.',
        type: "General"
    },
];

export const messsagesData = [
    {
        id: "1",
        fullName: "Jhon Smith",
        userImg: images.user1,
        lastSeen: "2023-11-16T04:52:06.501Z",
        lastMessage: 'I love you. see you soon baby',
        messageInQueue: 2,
        lastMessageTime: "12:25 PM",
        isOnline: true,
    },
    {
        id: "2",
        fullName: "Anuska Sharma",
        userImg: images.user2,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'I Know. you are so busy man.',
        messageInQueue: 0,
        lastMessageTime: "12:15 PM",
        isOnline: false
    },
    {
        id: "3",
        fullName: "Virat Kohili",
        userImg: images.user3,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Ok, see u soon',
        messageInQueue: 0,
        lastMessageTime: "09:12 PM",
        isOnline: true
    },
    {
        id: "4",
        fullName: "Shikhor Dhaon",
        userImg: images.user4,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'Great! Do you Love it.',
        messageInQueue: 0,
        lastMessageTime: "04:12 PM",
        isOnline: true
    },
    {
        id: "5",
        fullName: "Shakib Hasan",
        userImg: images.user5,
        lastSeen: "2023-11-21T04:52:06.501Z",
        lastMessage: 'Thank you !',
        messageInQueue: 2,
        lastMessageTime: "10:30 AM",
        isOnline: true
    },
    {
        id: "6",
        fullName: "Jacksoon",
        userImg: images.user6,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Do you want to go out dinner',
        messageInQueue: 3,
        lastMessageTime: "10:05 PM",
        isOnline: false
    },
    {
        id: "7",
        fullName: "Tom Jerry",
        userImg: images.user7,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Do you want to go out dinner',
        messageInQueue: 2,
        lastMessageTime: "11:05 PM",
        isOnline: true
    },
    {
        id: "8",
        fullName: "Lucky Luck",
        userImg: images.user8,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Can you share the design with me?',
        messageInQueue: 2,
        lastMessageTime: "09:11 PM",
        isOnline: true
    },
    {
        id: "9",
        fullName: "Nate Jack",
        userImg: images.user9,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Tell me what you want?',
        messageInQueue: 0,
        lastMessageTime: "06:43 PM",
        isOnline: true
    }
];

export const callData = [
    {
        id: "1",
        fullName: "Roselle Erhman",
        userImg: images.user10,
        status: "Incoming",
        date: "Dec 19, 2024"
    },
    {
        id: "2",
        fullName: "Willard Purnell",
        userImg: images.user9,
        status: "Outgoing",
        date: "Dec 17, 2024"
    },
    {
        id: "3",
        fullName: "Charlotte Hanlin",
        userImg: images.user8,
        status: "Missed",
        date: "Dec 16, 2024"
    },
    {
        id: "4",
        fullName: "Merlin Kevin",
        userImg: images.user7,
        status: "Missed",
        date: "Dec 16, 2024"
    },
    {
        id: "5",
        fullName: "Lavern Laboy",
        userImg: images.user6,
        status: "Outgoing",
        date: "Dec 16, 2024"
    },
    {
        id: "6",
        fullName: "Phyllis Godley",
        userImg: images.user5,
        status: "Incoming",
        date: "Dec 15, 2024"
    },
    {
        id: "7",
        fullName: "Tyra Dillon",
        userImg: images.user4,
        status: "Outgoing",
        date: "Dec 15, 2024"
    },
    {
        id: "8",
        fullName: "Marci Center",
        userImg: images.user3,
        status: "Missed",
        date: "Dec 15, 2024"
    },
    {
        id: "9",
        fullName: "Clinton Mccure",
        userImg: images.user2,
        status: "Outgoing",
        date: "Dec 15, 2024"
    },
];

export const banners = [
    {
      id: 1,
      discount: '40%',
      discountName: "Today's Special",
      bottomTitle: 'Get a discount for every estate order!',
      bottomSubtitle: 'Only valid for today!',
    },
    {
      id: 2,
      discount: '50%',
      discountName: "Weekend Sale",
      bottomTitle: 'Special discount for weekend orders!',
      bottomSubtitle: 'This weekend only!',
    },
    {
      id: 3,
      discount: '30%',
      discountName: "Limited Time Offer",
      bottomTitle: 'Hurry up! Limited time offer!',
      bottomSubtitle: 'Valid until supplies last!',
    },
    // Add more banner objects here
];

export const featuredEstates = [
    {
        id: "1",
        name: "Modernica Apartment",
        image: images.estate1,
        rating: 4.9,
        numReviews: 329,
        price: 590,
        location: "New York, US",
        categoryId: "2"
    },
    {
        id: "2",
        name: "Mill Super House",
        image: images.estate2,
        rating: 4.8,
        numReviews: 120,
        price: 260,
        location: "Jakarta, Indonesia",
        categoryId: "3"
    },
    {
        id: "3",
        name: "Cosy Cottage Retreat",
        image: images.estate3,
        rating: 4.7,
        numReviews: 75,
        price: 380,
        location: "London, UK",
        categoryId: "4"
    },
    {
        id: "4",
        name: "Sunny Seaside Villa",
        image: images.estate4,
        rating: 4.6,
        numReviews: 240,
        price: 710,
        location: "Los Angeles, US",
        categoryId: "2"
    },
    {
        id: "5",
        name: "Mountain View Chalet",
        image: images.estate5,
        rating: 4.9,
        numReviews: 412,
        price: 890,
        location: "Zurich, Switzerland",
        categoryId: "2"
    },
    {
        id: "6",
        name: "Rustic Farmhouse",
        image: images.estate6,
        rating: 4.5,
        numReviews: 98,
        price: 450,
        location: "Tuscany, Italy",
        categoryId: "3"
    },
    {
        id: "7",
        name: "Urban Loft",
        image: images.estate7,
        rating: 4.7,
        numReviews: 205,
        price: 620,
        location: "Berlin, Germany",
        categoryId: "3"
    },
    {
        id: "8",
        name: "Lakeside Retreat",
        image: images.estate8,
        rating: 4.8,
        numReviews: 153,
        price: 570,
        location: "Toronto, Canada",
        categoryId: "4"
    },
    {
        id: "9",
        name: "Luxury Penthouse",
        image: images.estate9,
        rating: 4.9,
        numReviews: 532,
        price: 1200,
        location: "Dubai, UAE",
        categoryId: "3"
    },
];

export const recommendedEstates = [
    {
        id: "1",
        name: "Secluded Beach House",
        image: images.estate9,
        rating: 4.9,
        numReviews: 287,
        price: 880,
        location: "Maui, Hawaii",
        categoryId: "3"
    },
    {
        id: "2",
        name: "Scenic Mountain Lodge",
        image: images.estate8,
        rating: 4.8,
        numReviews: 210,
        price: 72,
        location: "Banff, Canada",
        categoryId: "4" 
    },
    {
        id: "3",
        name: "Historic City Mansion",
        image: images.estate7,
        rating: 4.7,
        numReviews: 162,
        price: 1100,
        location: "Paris, France",
        categoryId: "2"
    },
    {
        id: "4",
        name: "Serenity Forest Cabin",
        image: images.estate6,
        rating: 4.9,
        numReviews: 389,
        price: 45,
        location: "Black Forest, Germany",
        categoryId: "2"
    },
    {
        id: "5",
        name: "Luxury Safari Lodge",
        image: images.estate5,
        rating: 4.6,
        numReviews: 98,
        price: 15,
        location: "Maasai Mara, Kenya",
        categoryId: "4"
    },
    {
        id: "6",
        name: "Cozy Lakeside Cabin",
        image: images.estate4,
        rating: 4.8,
        numReviews: 175,
        price: 58,
        location: "Lake District, UK",
        categoryId: "2"
    },
    {
        id: "7",
        name: "Tranquil Mountain Retreat",
        image: images.estate3,
        rating: 4.9,
        numReviews: 432,
        price: 96,
        location: "Aspen, US",
        categoryId: "5"
    },
    {
        id: "8",
        name: "Modern City Penthouse",
        image: images.estate2,
        rating: 4.7,
        numReviews: 249,
        price: 35,
        location: "Tokyo, Japan",
        categoryId: "3"
    },
    {
        id: "9",
        name: "Charming Countryside Cottage",
        image: images.estate1,
        rating: 4.8,
        numReviews: 198,
        price: 52,
        location: "Provence, France",
        categoryId: "2"
    },
];

export const allEstates = [
    {
        id: "1",
        name: "Secluded Beach House",
        image: images.estate9,
        rating: 4.9,
        numReviews: 287,
        price: 88,
        location: "Maui, Hawaii",
        categoryId: "3",
        facilities: ["Gym", "Parking", "Swimming Pool"]
    },
    {
        id: "2",
        name: "Scenic Mountain Lodge",
        image: images.estate8,
        rating: 4.8,
        numReviews: 210,
        price: 72,
        location: "Banff, Canada",
        categoryId: "4",
        facilities: ["Gym", "Parking"]
    },
    {
        id: "3",
        name: "Historic City Mansion",
        image: images.estate7,
        rating: 4.7,
        numReviews: 162,
        price: 56,
        location: "Paris, France",
        categoryId: "2",
        facilities: ["Car Parking", "Gym"]
    },
    {
        id: "4",
        name: "Serenity Forest Cabin",
        image: images.estate6,
        rating: 4.9,
        numReviews: 389,
        price: 45,
        location: "Black Forest, Germany",
        categoryId: "2",
        facilities: ["Gym", "Car Parking"]
    },
    {
        id: "5",
        name: "Luxury Safari Lodge",
        image: images.estate5,
        rating: 4.6,
        numReviews: 98,
        price: 74,
        location: "Maasai Mara, Kenya",
        categoryId: "4",
        facilities: ["Parking", "Swimming Pool"]
    },
    {
        id: "6",
        name: "Cozy Lakeside Cabin",
        image: images.estate4,
        rating: 4.8,
        numReviews: 175,
        price: 58,
        location: "Lake District, UK",
        categoryId: "2",
        facilities: ["Restaurant", "Gym"]
    },
    {
        id: "7",
        name: "Tranquil Mountain Retreat",
        image: images.estate3,
        rating: 4.9,
        numReviews: 432,
        price: 96,
        location: "Aspen, US",
        categoryId: "5",
        facilities: ["Parking", "Swimming Pool"]
    },
    {
        id: "8",
        name: "Modern City Penthouse",
        image: images.estate2,
        rating: 4.7,
        numReviews: 249,
        price: 99,
        location: "Tokyo, Japan",
        categoryId: "3",
        facilities: ["Gym", "Parking"]
    },
    {
        id: "9",
        name: "Charming Countryside Cottage",
        image: images.estate1,
        rating: 4.8,
        numReviews: 198,
        price: 52,
        location: "Provence, France",
        categoryId: "2",
        facilities: ["Swimming Pool", "Gym"]
    },
];

export const category = [
    {
        id: "1",
        name: "🏠 All"
    },
    {
        id: "2",
        name: "🏢 Apartments"
    },
    {
        id: "3",
        name: "🏡 Houses"
    },
    {
        id: "4",
        name: "🏘️ Condos"
    },
    {
        id: "5",
        name: "🏗️ Land"
    },
    {
        id: "6",
        name: "🏢 Commercial"
    },
    {
        id: "7",
        name: "🏝️ Vacation Homes"
    }
];

export const facilities = [
    {
        id: "1",
        name: "All"
    },
    {
        id: "2",
        name: "Car Parking"
    },
    {
        id: "3",
        name: "Swimming Pool"
    },
    {
        id: "4",
        name: "Gym"
    },
    {
        id: "5",
        name: "Parking"
    },
    {
        id: "6",
        name: "Restaurants"
    }
]

export const notifications = [
    {
        id: "1",
        title: "New Property Listing!",
        description: "A new property has been listed in your favorite area. Check it out now!",
        date: "2024-09-04T09:15:00.000Z",
        time: "09:15 AM",
        type: "Property",
        isNew: true
    },
    {
        id: "2",
        title: "Price Drop Alert!",
        description: "The price for a property you’re interested in has dropped. View the updated listing.",
        date: "2024-09-03T14:30:00.000Z",
        time: "02:30 PM",
        type: "Price",
        isNew: true
    },
    {
        id: "3",
        title: "New Message Received!",
        description: "You have a new message from a seller. Check your messages to respond.",
        date: "2024-09-02T11:45:00.000Z",
        time: "11:45 AM",
        type: "Message",
        isNew: false
    },
    {
        id: "4",
        title: "Open House Event!",
        description: "An open house event is scheduled for one of your saved properties. Don’t miss it!",
        date: "2024-09-01T16:00:00.000Z",
        time: "04:00 PM",
        type: "Event",
        isNew: false
    },
    {
        id: "5",
        title: "Application Approved!",
        description: "Your application for a property has been approved. Congratulations!",
        date: "2024-08-30T10:00:00.000Z",
        time: "10:00 AM",
        type: "Application",
        isNew: false
    },
    {
        id: "6",
        title: "New Agent Available!",
        description: "A new agent specializing in properties in your area has joined our platform.",
        date: "2024-08-29T13:20:00.000Z",
        time: "01:20 PM",
        type: "Agent",
        isNew: false
    },
    {
        id: "7",
        title: "Maintenance Notification!",
        description: "Scheduled maintenance will occur on September 5, 2024, from 01:00 AM to 03:00 AM.",
        date: "2024-08-28T08:00:00.000Z",
        time: "08:00 AM",
        type: "System",
        isNew: false
    },
    {
        id: "8",
        title: "New Feature Alert!",
        description: "Reasa now supports virtual tours for all listed properties. Explore homes from the comfort of your own.",
        date: "2024-08-27T09:00:00.000Z",
        time: "09:00 AM",
        type: "Feature",
        isNew: false
    },
    {
        id: "9",
        title: "Referral Program!",
        description: "Refer friends to Reasa and earn rewards for each successful referral.",
        date: "2024-08-26T14:30:00.000Z",
        time: "02:30 PM",
        type: "Referral",
        isNew: false
    },
    {
        id: "10",
        title: "Password Change Confirmed!",
        description: "Your password has been successfully updated. If you did not request this change, contact support immediately.",
        date: "2024-08-25T07:45:00.000Z",
        time: "07:45 AM",
        type: "Security",
        isNew: false
    }
];


export const ratings = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "6",
        title: "5"
    },
    {
        id: "5",
        title: "4"
    },
    {
        id: "4",
        title: "3"
    },
    {
        id: "3",
        title: "2"
    },
    {
        id: "2",
        title: "1"
    }
];


export const estateFacilties = [
    {
        id: "1",
        name: "Car Parking",
        icon: icons.car,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "2",
        name: "Swimming Pool",
        icon: icons.swimming,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "3",
        name: "Gym & Fitness",
        icon: icons.dumbell,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "4",
        name: "Restaurant",
        icon: icons.restaurant,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "5",
        name: "Wifi & Network",
        icon: icons.wifi,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "6",
        name: "Pet Center",
        icon: icons.pet,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "7",
        name: "Sport Center",
        icon: icons.sport,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    },
    {
        id: "8",
        name: "Laundry",
        icon: icons.laundry,
        iconColor: COLORS.primary,
        backgroundColor: COLORS.tansparentPrimary,
    }
];

export const apartmentReviews = [
    {
        id: "1",
        avatar: images.user1,
        name: "Maria Thompson",
        description: "The location of this apartment is exceptional! The neighborhood is very friendly and convenient. Highly recommended! 😍",
        rating: 4.8,
        avgRating: 5,
        date: "2024-01-23T04:52:06.501Z",
        numLikes: 948
    },
    {
        id: "2",
        avatar: images.user2,
        name: "Ethan Harris",
        description: "I had a wonderful experience living in this apartment. The ambiance is great and I felt very comfortable.",
        rating: 4.7,
        avgRating: 5,
        date: "2024-01-23T04:52:06.501Z",
        numLikes: 120
    },
    {
        id: "3",
        avatar: images.user3,
        name: "Sophia Martinez",
        description: "Amazing location! The amenities here are really convenient. I'll definitely be renewing my lease!",
        rating: 4.7,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 89
    },
    {
        id: "4",
        avatar: images.user4,
        name: "Michael Johnson",
        description: "I'm very satisfied with my stay in this apartment. The management was professional and responsive.",
        rating: 4,
        avgRating: 4,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 384
    },
    {
        id: "5",
        avatar: images.user5,
        name: "Emma Wilson",
        description: "Great apartment with top-notch facilities! I felt refreshed and safe living here. Highly recommend!",
        rating: 4.3,
        avgRating: 4,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 738
    },
    {
        id: "6",
        avatar: images.user6,
        name: "Oliver Brown",
        description: "The management here is amazing! They addressed all my concerns promptly and exceeded my expectations.",
        rating: 4.8,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 12
    },
    {
        id: "7",
        avatar: images.user7,
        name: "Isabella White",
        description: "I had a fantastic experience living in this apartment. The management was friendly and the amenities were excellent!",
        rating: 4.9,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 450
    }
];

export const gallery = {
    bathrooms: [
        {
            id: "1",
            image: images.bathroom1
        },
        {
            id: "2",
            image: images.bathroom2
        },
        {
            id: "3",
            image: images.bathroom3
        },
        {
            id: "4",
            image: images.bathroom4
        },
        {
            id: "5",
            image: images.bathroom5
        },
        {
            id: "6",
            image: images.bathroom6
        },
        {
            id: "7",
            image: images.bathroom7
        }
    ],
    bedrooms: [
        {
            id: "1",
            image: images.bedroom1
        },
        {
            id: "2",
            image: images.bedroom2
        },
        {
            id: "3",
            image: images.bedroom3
        },
        {
            id: "4",
            image: images.bedroom4
        },
        {
            id: "5",
            image: images.bedroom5
        },
        {
            id: "6",
            image: images.bedroom6
        },
        {
            id: "7",
            image: images.bedroom7
        }
    ],
    kitchens: [
        {
            id: "1",
            image: images.kitchen1
        },
        {
            id: "2",
            image: images.kitchen2
        },
        {
            id: "3",
            image: images.kitchen3
        },
        {
            id: "4",
            image: images.kitchen4
        },
        {
            id: "5",
            image: images.kitchen5
        },
        {
            id: "6",
            image: images.kitchen6
        },
        {
            id: "7",
            image: images.kitchen7
        }
    ],
    livingrooms: [
        {
            id: "1",
            image: images.livingroom1
        },
        {
            id: "2",
            image: images.livingroom2
        },
        {
            id: "3",
            image: images.livingroom3
        },
        {
            id: "4",
            image: images.livingroom4
        },
        {
            id: "5",
            image: images.livingroom5
        },
        {
            id: "6",
            image: images.livingroom6
        },
        {
            id: "7",
            image: images.livingroom7
        }
    ],
    parkings: [
        {
            id: "1",
            image: images.parking1
        },
        {
            id: "2",
            image: images.parking2
        },
        {
            id: "3",
            image: images.parking3
        },
        {
            id: "4",
            image: images.parking4
        },
        {
            id: "5",
            image: images.parking5
        },
        {
            id: "6",
            image: images.parking6
        },
        {
            id: "7",
            image: images.parking7
        }
    ] 
};


export const myFavouriteEstates = [
    {
        id: "1",
        name: "Secluded Beach House",
        image: images.estate9,
        rating: 4.9,
        numReviews: 287,
        price: 88,
        location: "Maui, Hawaii",
        categoryId: "3",
        facilities: ["Gym", "Parking", "Swimming Pool"]
    },
    {
        id: "2",
        name: "Scenic Mountain Lodge",
        image: images.estate8,
        rating: 4.8,
        numReviews: 210,
        price: 72,
        location: "Banff, Canada",
        categoryId: "4",
        facilities: ["Gym", "Parking"]
    },
    {
        id: "3",
        name: "Historic City Mansion",
        image: images.estate7,
        rating: 4.7,
        numReviews: 162,
        price: 56,
        location: "Paris, France",
        categoryId: "2",
        facilities: ["Car Parking", "Gym"]
    },
    {
        id: "4",
        name: "Serenity Forest Cabin",
        image: images.estate6,
        rating: 4.9,
        numReviews: 389,
        price: 45,
        location: "Black Forest, Germany",
        categoryId: "2",
        facilities: ["Gym", "Car Parking"]
    },
    {
        id: "5",
        name: "Luxury Safari Lodge",
        image: images.estate5,
        rating: 4.6,
        numReviews: 98,
        price: 74,
        location: "Maasai Mara, Kenya",
        categoryId: "4",
        facilities: ["Parking", "Swimming Pool"]
    },
    {
        id: "6",
        name: "Cozy Lakeside Cabin",
        image: images.estate4,
        rating: 4.8,
        numReviews: 175,
        price: 58,
        location: "Lake District, UK",
        categoryId: "2",
        facilities: ["Restaurant", "Gym"]
    },
    {
        id: "7",
        name: "Tranquil Mountain Retreat",
        image: images.estate3,
        rating: 4.9,
        numReviews: 432,
        price: 96,
        location: "Aspen, US",
        categoryId: "5",
        facilities: ["Parking", "Swimming Pool"]
    },
    {
        id: "8",
        name: "Modern City Penthouse",
        image: images.estate2,
        rating: 4.7,
        numReviews: 249,
        price: 99,
        location: "Tokyo, Japan",
        categoryId: "3",
        facilities: ["Gym", "Parking"]
    },
    {
        id: "9",
        name: "Charming Countryside Cottage",
        image: images.estate1,
        rating: 4.8,
        numReviews: 198,
        price: 52,
        location: "Provence, France",
        categoryId: "2",
        facilities: ["Swimming Pool", "Gym"]
    },
];

export const upcomingBooking = [
    {
        id: 1,
        status: "Unpaid",
        checkInDate: "28 Feb, 2025",
        checkOutDate: "07 Mar, 2025",
        name: "Elegant Estates",
        image: images.estate1,
        pricePerDay: 150,
        duration: 7,
        totalPrice: 1050,
        address: "123 Main St, Cityville",
        features: ["3 Bedrooms", "2 Bathrooms", "Garden"],
        hasRemindMe: true,
        rating: 4.9,
    },
    {
        id: 2,
        status: "Paid",
        checkInDate: "03 Mar, 2025",
        checkOutDate: "08 Mar, 2025",
        name: "Prime Properties",
        image: images.estate2,
        pricePerDay: 120,
        duration: 5,
        totalPrice: 600,
        address: "0993, Novick Parkway",
        features: ["2 Bedrooms", "1 Bathroom", "Balcony"],
        hasRemindMe: true,
        rating: 4.7
    },
    {
        id: 3,
        status: "Unpaid",
        checkInDate: "12 Mar, 2025",
        checkOutDate: "19 Mar, 2025",
        name: "Luxury Living",
        image: images.estate3,
        pricePerDay: 200,
        duration: 8,
        totalPrice: 1600,
        address: "8923, Butterfield Place",
        features: ["4 Bedrooms", "3 Bathrooms", "Swimming Pool"],
        hasRemindMe: false,
        rating: 4.8
    },
    {
        id: 4,
        status: "Paid",
        checkInDate: "15 Mar, 2025",
        checkOutDate: "20 Mar, 2025",
        name: "Cityscape Condos",
        image: images.estate4,
        pricePerDay: 180,
        duration: 6,
        totalPrice: 1080,
        address: "678 Maple Avenue",
        features: ["2 Bedrooms", "2 Bathrooms", "Fitness Center"],
        hasRemindMe: true,
        rating: 4.6
    },
    {
        id: 5,
        status: "Unpaid",
        checkInDate: "20 Mar, 2025",
        checkOutDate: "27 Mar, 2025",
        name: "Harbor View Apartments",
        image: images.estate5,
        pricePerDay: 100,
        duration: 7,
        totalPrice: 700,
        address: "456 Oak Street",
        features: ["1 Bedroom", "1 Bathroom", "Ocean View"],
        hasRemindMe: false,
        rating: 4.7,
    },
    {
        id: 6,
        status: "Paid",
        checkInDate: "25 Mar, 2025",
        checkOutDate: "02 Apr, 2025",
        name: "Skyline Towers",
        image: images.estate7,
        pricePerDay: 220,
        duration: 9,
        totalPrice: 1980,
        address: "1010 Pine Road",
        features: ["3 Bedrooms", "2 Bathrooms", "City View"],
        hasRemindMe: true,
        rating: 4.8,
    },
    {
        id: 7,
        status: "Unpaid",
        checkInDate: "30 Mar, 2025",
        checkOutDate: "05 Apr, 2025",
        name: "Meadowbrook Villas",
        image: images.estate7,
        pricePerDay: 130,
        duration: 6,
        totalPrice: 780,
        address: "246 Willow Lane",
        features: ["2 Bedrooms", "1 Bathroom", "Playground"],
        hasRemindMe: false,
        rating: 4.9,
    }
];

export const completedBooking = [
    {
        id: 1,
        status: "Paid",
        checkInDate: "28 Feb, 2025",
        checkOutDate: "07 Mar, 2025",
        name: "Elite Estates",
        image: images.estate7,
        pricePerDay: 150,
        duration: 7,
        totalPrice: 1050,
        address: "123 Main St, Cityville",
        features: ["3 Bedrooms", "2 Bathrooms", "Garden"]
    },
    {
        id: 2,
        status: "Paid",
        checkInDate: "03 Mar, 2025",
        checkOutDate: "08 Mar, 2025",
        name: "Premium Properties",
        image: images.estate8,
        pricePerDay: 120,
        duration: 5,
        totalPrice: 600,
        address: "0993, Novick Parkway",
        features: ["2 Bedrooms", "1 Bathroom", "Balcony"],
        rating: 4.7,
    },
    {
        id: 3,
        status: "Paid",
        checkInDate: "12 Mar, 2025",
        checkOutDate: "19 Mar, 2025",
        name: "Luxury Living",
        image: images.estate6,
        pricePerDay: 200,
        duration: 8,
        totalPrice: 1600,
        address: "8923, Butterfield Place",
        features: ["4 Bedrooms", "3 Bathrooms", "Swimming Pool"],
        rating: 4.8
    },
    {
        id: 4,
        status: "Paid",
        checkInDate: "15 Mar, 2025",
        checkOutDate: "20 Mar, 2025",
        name: "Cityscape Condos",
        image: images.estate5,
        pricePerDay: 180,
        duration: 6,
        totalPrice: 1080,
        address: "678 Maple Avenue",
        features: ["2 Bedrooms", "2 Bathrooms", "Fitness Center"],
        rating: 4.7
    },
    {
        id: 5,
        status: "Paid",
        checkInDate: "20 Mar, 2025",
        checkOutDate: "27 Mar, 2025",
        name: "Harbor View Apartments",
        image: images.estate3,
        pricePerDay: 100,
        duration: 7,
        totalPrice: 700,
        address: "456 Oak Street",
        features: ["1 Bedroom", "1 Bathroom", "Ocean View"],
        rating: 4.9,
    },
    {
        id: 6,
        status: "Paid",
        checkInDate: "25 Mar, 2025",
        checkOutDate: "02 Apr, 2025",
        name: "Skyline Towers",
        image: images.estate2,
        pricePerDay: 220,
        duration: 9,
        totalPrice: 1980,
        address: "1010 Pine Road",
        features: ["3 Bedrooms", "2 Bathrooms", "City View"],
        rating: 4.8
    },
    {
        id: 7,
        status: "Paid",
        checkInDate: "30 Mar, 2025",
        checkOutDate: "05 Apr, 2025",
        name: "Meadowbrook Villas",
        image: images.estate1,
        pricePerDay: 130,
        duration: 6,
        totalPrice: 780,
        address: "246 Willow Lane",
        features: ["2 Bedrooms", "1 Bathroom", "Playground"],
        rating: 4.9,
    }
];

export const cancelledBooking = [
    {
        id: 1,
        status: "Unpaid",
        checkInDate: "28 Feb, 2025",
        checkOutDate: "07 Mar, 2025",
        name: "Elegant Estates",
        image: images.estate1,
        pricePerDay: 150,
        duration: 7,
        totalPrice: 1050,
        address: "123 Main St, Cityville",
        features: ["3 Bedrooms", "2 Bathrooms", "Garden"],
        rating: 4.8
    },
    {
        id: 2,
        status: "Unpaid",
        checkInDate: "03 Mar, 2025",
        checkOutDate: "08 Mar, 2025",
        name: "Prime Properties",
        image: images.estate2,
        pricePerDay: 120,
        duration: 5,
        totalPrice: 600,
        address: "0993, Novick Parkway",
        features: ["2 Bedrooms", "1 Bathroom", "Balcony"],
        rating: 4.7
    },
    {
        id: 3,
        status: "Unpaid",
        checkInDate: "12 Mar, 2025",
        checkOutDate: "19 Mar, 2025",
        name: "Luxury Living",
        image: images.estate3,
        pricePerDay: 200,
        duration: 8,
        totalPrice: 1600,
        address: "8923, Butterfield Place",
        features: ["4 Bedrooms", "3 Bathrooms", "Swimming Pool"],
        rating: 4.9,
    },
    {
        id: 4,
        status: "Unpaid",
        checkInDate: "15 Mar, 2025",
        checkOutDate: "20 Mar, 2025",
        name: "Cityscape Condos",
        image: images.estate4,
        pricePerDay: 180,
        duration: 6,
        totalPrice: 1080,
        address: "678 Maple Avenue",
        features: ["2 Bedrooms", "2 Bathrooms", "Fitness Center"],
        rating: 4.8
    },
    {
        id: 5,
        status: "Unpaid",
        checkInDate: "20 Mar, 2025",
        checkOutDate: "27 Mar, 2025",
        name: "Harbor View Apartments",
        image: images.estate5,
        pricePerDay: 100,
        duration: 7,
        totalPrice: 700,
        address: "456 Oak Street",
        features: ["1 Bedroom", "1 Bathroom", "Ocean View"],
        rating: 4.9,
    },
    {
        id: 6,
        status: "Unpaid",
        checkInDate: "25 Mar, 2025",
        checkOutDate: "02 Apr, 2025",
        name: "Skyline Towers",
        image: images.estate6,
        pricePerDay: 220,
        duration: 9,
        totalPrice: 1980,
        address: "1010 Pine Road",
        features: ["3 Bedrooms", "2 Bathrooms", "City View"],
        rating: 4.8
    },
    {
        id: 7,
        status: "Unpaid",
        checkInDate: "30 Mar, 2025",
        checkOutDate: "05 Apr, 2025",
        name: "Meadowbrook Villas",
        image: images.estate7,
        pricePerDay: 130,
        duration: 6,
        totalPrice: 780,
        address: "246 Willow Lane",
        features: ["2 Bedrooms", "1 Bathroom", "Playground"],
        rating: 4.6
    }
];

export const userAddresses = [
    {
        id: "1",
        name: "Home",
        address: "364 Stillwater Ave, Attleboro, MA 02703",
    },
    {
        id: "2",
        name: "Office",
        address: "73 Virginia Rd, Cuyahoga Falls, OH 44221",
    },
    {
        id: "3",
        name: "Mall Plaza",
        address: "123 Main St, San Francisco, CA 94107",
    },
    {
        id: "4",
        name: "Garden Park",
        address: "600 Bloom St, Portland, OR 97201",
    },
    {
        id: "5",
        name: "Grand City Park",
        address: "26 State St Daphne, AL 36526"
    },
    {
        id: "6",
        name: "Town Square",
        address: "20 Applegate St. Hoboken, NJ 07030"
    },
    {
        id: "7",
        name: "Bank",
        address: "917 W Pine Street Easton, PA 0423"
    }
];