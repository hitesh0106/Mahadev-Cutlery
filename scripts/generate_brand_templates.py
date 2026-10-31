import json
import os

brands = [
    {
        'handle': 'jockey',
        'name': 'Jockey',
        'intro': 'Explore 100% authentic Jockey innerwear, loungewear, vests, and everyday socks curated directly from authorized distributors.',
        'taxonomy': 'Verified Jockey Innerwear & Loungewear',
        'categories': [
            {'title': "Men's Innerwear", 'sub': 'Briefs, trunks, boxers & vests'},
            {'title': "Women's Innerwear", 'sub': 'Panties, bras & daily comfort'},
            {'title': 'Socks', 'sub': 'Formal, casual & athletic cotton socks'},
            {'title': 'Loungewear', 'sub': 'Relaxed shorts, track pants & tees'},
            {'title': 'All Jockey Products', 'sub': 'Complete brand catalogue'}
        ]
    },
    {
        'handle': 'van-heusen',
        'name': 'Van Heusen',
        'intro': 'Premium Van Heusen innerwear, vests, and refined loungewear crafted for modern sophistication and effortless all-day comfort.',
        'taxonomy': 'Verified Van Heusen Innerwear & Loungewear',
        'categories': [
            {'title': "Men's Innerwear", 'sub': 'Vests, briefs & comfort trunks'},
            {'title': "Men's Loungewear", 'sub': 'Track pants, shorts & sleep tees'},
            {'title': 'All Van Heusen Products', 'sub': 'Complete Van Heusen range'}
        ]
    },
    {
        'handle': 'zoiro',
        'name': 'Zoiro',
        'intro': "Authentic Zoiro men's nikar and innerwear. Italian-inspired cuts crafted exclusively for discerning men.",
        'taxonomy': "STRICT: Men's Innerwear & Nikar ONLY",
        'categories': [
            {'title': "Men's Innerwear", 'sub': "Signature men's trunks & stretch briefs"},
            {'title': "Men's Nikar", 'sub': "Men's daily comfort cotton nikar"},
            {'title': "Men's Briefs", 'sub': 'Stretch waistband comfort briefs'},
            {'title': 'All Zoiro Products', 'sub': "Verified men's innerwear only"}
        ]
    },
    {
        'handle': 'sunny',
        'name': 'Sunny',
        'intro': 'Verified store favourites and comfortable daily hosiery from Sunny, stocked at our Ahmedabad showroom.',
        'taxonomy': 'Verified Sunny Store Stock',
        'categories': [
            {'title': 'Verified Innerwear', 'sub': 'Authentic stocked innerwear basics'},
            {'title': 'All Sunny Products', 'sub': 'Verified store inventory'}
        ]
    },
    {
        'handle': 'bodycare',
        'name': 'Bodycare',
        'intro': 'Comfortable, skin-friendly innerwear and hosiery designed specifically for women, girls, and boys.',
        'taxonomy': "STRICT: Women's & Children's ONLY (No Men's)",
        'categories': [
            {'title': "Women's Innerwear", 'sub': 'Daily comfortable inner essentials'},
            {'title': "Women's Hosiery", 'sub': 'Soft leggings, slips & camisoles'},
            {'title': 'Kids Boys Innerwear', 'sub': 'Pure cotton vests & briefs for boys'},
            {'title': 'Kids Girls Innerwear', 'sub': 'Comfort bloomers, slips & undergarments'},
            {'title': 'All Bodycare Products', 'sub': "Complete women's & kids collection"}
        ]
    },
    {
        'handle': 'lady-care',
        'name': 'Lady Care',
        'intro': "Dedicated women's innerwear crafted from soft, breathable cotton. Specialized in verified panties and comfort nikar.",
        'taxonomy': "STRICT: Verified Women's Products Only",
        'categories': [
            {'title': "Women's Nikar", 'sub': 'Pure breathable cotton nikar'},
            {'title': "Women's Panty", 'sub': 'Everyday hipster, midi & full briefs'},
            {'title': "Women's Innerwear", 'sub': 'Daily verified inner essentials'},
            {'title': 'All Lady Care Products', 'sub': 'Complete Lady Care catalogue'}
        ]
    },
    {
        'handle': 'loreal-paris',
        'name': "L'Oréal Paris",
        'intro': 'World-class everyday beauty, innovative haircare solutions, rich ammonia-free hair colours, and gentle facial care.',
        'taxonomy': 'Consumer Haircare, Skincare & Makeup (Separate Brand)',
        'categories': [
            {'title': 'Shampoo', 'sub': 'Total Repair 5 & Hyaluron Moisture'},
            {'title': 'Conditioner', 'sub': 'Smooth intense & nourishing conditioners'},
            {'title': 'Hair Serum', 'sub': 'Extraordinary oil & anti-frizz serums'},
            {'title': 'Hair Colour', 'sub': 'Excellence Creme & Casting Creme Gloss'},
            {'title': "All L'Oréal Paris Products", 'sub': "Complete L'Oréal Paris collection"}
        ]
    },
    {
        'handle': 'loreal-professionnel',
        'name': "L'Oréal Professionnel",
        'intro': 'Professional salon-grade hair treatments, reparative masks, and specialized haircare used by top hairstylists worldwide.',
        'taxonomy': 'STRICT: Professional Salon Haircare Only (Separate Brand)',
        'categories': [
            {'title': 'Professional Shampoo', 'sub': 'Absolut Repair, Vitamino & Metal Detox'},
            {'title': 'Conditioner', 'sub': 'Salon-grade conditioning emulsions'},
            {'title': 'Hair Masks', 'sub': 'Deep lipidic restorative hair masks'},
            {'title': 'Hair Serums', 'sub': 'Absolut Repair 10-in-1 multi-benefit oil'},
            {'title': 'Hair Treatments', 'sub': 'Scalp Advanced & Molecular repair'},
            {'title': "All L'Oréal Professionnel Products", 'sub': 'Complete salon professional range'}
        ]
    },
    {
        'handle': 'matrix',
        'name': 'Matrix',
        'intro': 'Professional American salon haircare and botanical Biolage solutions that repair, smooth, and transform hair health.',
        'taxonomy': 'Professional Salon Haircare & Biolage',
        'categories': [
            {'title': 'Shampoo', 'sub': 'Biolage Smoothproof, Colorlast & Scalppure'},
            {'title': 'Conditioner', 'sub': 'Botanical salon smoothing conditioners'},
            {'title': 'Hair Masks', 'sub': 'Ultra hydrasource deep treatment packs'},
            {'title': 'Hair Serums', 'sub': 'Biolage 6-in-1 smooth hair serum'},
            {'title': 'Hair Treatments', 'sub': 'Opti.Care professional split-end sealers'},
            {'title': 'All Matrix Products', 'sub': 'Complete Matrix salon haircare'}
        ]
    },
    {
        'handle': 'wella-professionals',
        'name': 'Wella Professionals',
        'intro': 'Over 140 years of German salon mastery. Specialized in Invigo hair nutrition, Color Brilliance, and salon-grade care.',
        'taxonomy': 'Expert Salon Haircare & Treatments',
        'categories': [
            {'title': 'Shampoo', 'sub': 'Invigo Nutri-Enrich & Color Brilliance'},
            {'title': 'Conditioner', 'sub': 'Deep moisturizing salon conditioners'},
            {'title': 'Hair Masks', 'sub': 'Nutri-Enrich deep nourishing masks'},
            {'title': 'Hair Colour', 'sub': 'Koleston & Color Touch salon shades'},
            {'title': 'Hair Treatments', 'sub': 'Oil Reflections luminous smoothing oil'},
            {'title': 'All Wella Professionals Products', 'sub': 'Complete Wella salon catalogue'}
        ]
    },
    {
        'handle': 'colorbar',
        'name': 'Colorbar',
        'intro': 'Vibrant, cruelty-free premium cosmetics, longwear lipsticks, flawless foundations, and rich salon-quality nail lacquers.',
        'taxonomy': 'Cosmetics, Eye Makeup & Nail Care',
        'categories': [
            {'title': 'Lip Makeup', 'sub': 'Sinful matte & velvet lip colours'},
            {'title': 'Face Makeup', 'sub': 'Flawless foundations, primers & compacts'},
            {'title': 'Eye Makeup', 'sub': 'Intense eyeliners, kajal & mascaras'},
            {'title': 'Nail Products', 'sub': 'Luxe nail enamels & gentle removers'},
            {'title': 'Makeup Tools', 'sub': 'Professional makeup brushes & blenders'},
            {'title': 'All Colorbar Products', 'sub': 'Complete Colorbar cosmetics range'}
        ]
    },
    {
        'handle': 'lakme',
        'name': 'Lakmé',
        'intro': "India's iconic cosmetics and skincare pioneer. From signature 9to5 lip shades and Eyeconic kajal to gentle daily hydration.",
        'taxonomy': 'Iconic Cosmetics, Primers & Gentle Skincare',
        'categories': [
            {'title': 'Lip Makeup', 'sub': 'Matte, creme & mousse lipsticks'},
            {'title': 'Face Makeup', 'sub': '9to5 primer matte foundation & compacts'},
            {'title': 'Eye Makeup', 'sub': 'Eyeconic kajal, precision liners & mascara'},
            {'title': 'Skincare', 'sub': 'Peach milk moisturiser & gentle face washes'},
            {'title': 'Sunscreen', 'sub': 'Sun Expert ultra matte lotion & gel'},
            {'title': 'All Lakmé Products', 'sub': 'Complete Lakmé beauty catalogue'}
        ]
    },
    {
        'handle': 'mars-cosmetics',
        'name': 'MARS Cosmetics',
        'intro': 'Trendsetting, highly pigmented, and accessible beauty essentials designed specifically for diverse Indian skin tones.',
        'taxonomy': 'Trendy Makeup Kits, Palettes & Tools',
        'categories': [
            {'title': 'Lip Makeup', 'sub': 'Non-transfer liquid lipsticks & lip liners'},
            {'title': 'Face Makeup', 'sub': 'BB creams, blush, contour & highlighters'},
            {'title': 'Eye Makeup', 'sub': 'Vibrant eyeshadow palettes & smudgeproof kajal'},
            {'title': 'Makeup Kits', 'sub': 'Curated all-in-one beauty gift boxes'},
            {'title': 'Beauty Tools', 'sub': 'Soft artist brushes & beauty blenders'},
            {'title': 'All MARS Products', 'sub': 'Complete MARS cosmetics collection'}
        ]
    },
    {
        'handle': 'maybelline-new-york',
        'name': 'Maybelline New York',
        'intro': 'High-energy New York beauty innovations. Famous for Fit Me complexion perfection, Colossal volume, and SuperStay lip color.',
        'taxonomy': 'Foundations, Mascaras, Eye & Lip Makeup',
        'categories': [
            {'title': 'Lip Makeup', 'sub': 'SuperStay matte ink & Color Sensational'},
            {'title': 'Face Makeup', 'sub': 'Fit Me matte + poreless foundation'},
            {'title': 'Eye Makeup', 'sub': 'Colossal kajal, precise liquid liners'},
            {'title': 'Foundation & Concealer', 'sub': 'Fit Me concealers & setting powders'},
            {'title': 'Mascara & Kajal', 'sub': 'Hypercurl & Colossal volume mascaras'},
            {'title': 'All Maybelline Products', 'sub': 'Complete Maybelline New York collection'}
        ]
    },
    {
        'handle': 'lotus-herbals',
        'name': 'Lotus Herbals',
        'intro': 'Pure herbal efficacy backed by botanical science. Trusted for Safe Sun UV defense and WhiteGlow rejuvenating skincare.',
        'taxonomy': 'STRICT: Botanical Skincare & Sun Protection (Not Makeup)',
        'categories': [
            {'title': 'Skincare', 'sub': 'WhiteGlow & YouthRx herbal treatments'},
            {'title': 'Face Care', 'sub': 'Gentle botanical face washes & cleansers'},
            {'title': 'Sunscreen', 'sub': 'Safe Sun matte gel SPF 50 sunblock'},
            {'title': 'Cleansers', 'sub': 'Herbal cleansing milks & balancing toners'},
            {'title': 'Moisturisers', 'sub': 'Nutramoist & alphamoist daily lotions'},
            {'title': 'All Lotus Herbals Products', 'sub': 'Complete herbal skincare collection'}
        ]
    },
    {
        'handle': 'swiss-beauty',
        'name': 'Swiss Beauty',
        'intro': 'Glamour made effortless with high-coverage liquid concealers, trend eyeshadow palettes, velvet lipsticks, and pro tools.',
        'taxonomy': 'Cosmetics, Concealers & Beauty Tools',
        'categories': [
            {'title': 'Lip Makeup', 'sub': 'Matte lip crayons, gloss & lip liners'},
            {'title': 'Face Makeup', 'sub': 'Liquid concealers, primers & baked blush'},
            {'title': 'Eye Makeup', 'sub': 'Ultimate eyeshadow palettes & metallic liners'},
            {'title': 'Foundation & Concealer', 'sub': 'Airbrush foundation & HD concealers'},
            {'title': 'Nail Products', 'sub': 'High-shine nail lacquers'},
            {'title': 'Beauty Tools', 'sub': 'Precision makeup brushes & sponges'},
            {'title': 'All Swiss Beauty Products', 'sub': 'Complete Swiss Beauty catalogue'}
        ]
    },
    {
        'handle': 'faces-canada',
        'name': 'Faces Canada',
        'intro': 'Proud Canadian heritage with over 40 years of lightweight, skin-loving, paraben-free foundations, kajals, and lipsticks.',
        'taxonomy': 'Lipsticks, Foundations & Nail Care',
        'categories': [
            {'title': 'Lip Makeup', 'sub': 'Ultime Pro HD intense matte lipsticks'},
            {'title': 'Face Makeup', 'sub': 'Weightless matte finish foundation & compact'},
            {'title': 'Eye Makeup', 'sub': 'Magneteyes 24HR kajal & liquid eyeliners'},
            {'title': 'Nail Products', 'sub': 'Splash long-stay chip-resistant nail enamels'},
            {'title': 'All Faces Canada Products', 'sub': 'Complete Faces Canada beauty range'}
        ]
    },
    {
        'handle': 'o3-plus',
        'name': 'O3+',
        'intro': "India's leading professional salon facial brand. Dermatologically formulated for brightening, anti-tan, and deep skin repair.",
        'taxonomy': 'Professional Facial Care & Serums',
        'categories': [
            {'title': 'Face Care', 'sub': 'Brightening & anti-tan facial cleansers'},
            {'title': 'Cleansers', 'sub': 'Derma clean foaming washes & toners'},
            {'title': 'Serums', 'sub': 'Hyaluronic & Vitamin C salon serums'},
            {'title': 'Moisturisers', 'sub': 'Hydrating massage creams & lotions'},
            {'title': 'Professional Skincare', 'sub': 'D-Tan packs & bridal glow facial kits'},
            {'title': 'All O3+ Products', 'sub': 'Complete O3+ professional range'}
        ]
    },
    {
        'handle': 'cetaphil',
        'name': 'Cetaphil',
        'intro': 'Trusted by dermatologists for over 75 years. Formulated with a dermatologist-backed blend of Vitamin B3, Provitamin B5 & Glycerin.',
        'taxonomy': 'Gentle Dermatologist-Recommended Care',
        'categories': [
            {'title': 'Face Cleansers', 'sub': 'Gentle skin cleanser for sensitive skin'},
            {'title': 'Moisturisers', 'sub': 'DAM daily advance ultra hydrating lotion'},
            {'title': 'Body Care', 'sub': 'Moisturising cream for dry sensitive skin'},
            {'title': 'All Cetaphil Products', 'sub': 'Complete Cetaphil dermatological range'}
        ]
    },
    {
        'handle': 'sebamed',
        'name': 'Sebamed',
        'intro': 'Medical skincare with exact pH 5.5 to support the natural barrier of your skin. 100% soap and alkali free.',
        'taxonomy': 'pH 5.5 Balanced Skin & Body Care',
        'categories': [
            {'title': 'Face Care', 'sub': 'Clear face foam & protective care gel'},
            {'title': 'Body Care', 'sub': 'pH 5.5 shower emulsions & body lotions'},
            {'title': 'Cleansers', 'sub': 'Soap-free cleansing bars for sensitive skin'},
            {'title': 'Baby Care', 'sub': 'Gentle baby wash, lotions & soothing cream'},
            {'title': 'All Sebamed Products', 'sub': 'Complete Sebamed medical skincare'}
        ]
    },
    {
        'handle': 'pilgrim',
        'name': 'Pilgrim',
        'intro': 'Discovery-led non-toxic beauty. Harnessing native beauty secrets from Jeju Island (Korea) and Bordeaux (France) for hair and skin.',
        'taxonomy': 'Discovery-Led Beauty & Active Serums',
        'categories': [
            {'title': 'Face Care', 'sub': 'Volcanic lava ash & red vine face cleansers'},
            {'title': 'Serums', 'sub': 'Alpha arbutin, 24K gold & squalane serums'},
            {'title': 'Moisturisers', 'sub': 'Oil-free gel moisturiser with hyaluronic acid'},
            {'title': 'Sunscreen', 'sub': 'Broad spectrum invisible sunscreens'},
            {'title': 'Haircare', 'sub': 'Patua & red clover hair growth serums'},
            {'title': 'All Pilgrim Products', 'sub': 'Complete Pilgrim beauty routines'}
        ]
    },
    {
        'handle': 'minimalist',
        'name': 'Minimalist',
        'intro': 'Revolutionary transparent skincare. Pure, potent active ingredients with zero fragrance and full disclosure of percentages.',
        'taxonomy': 'Transparent Active Science Skincare',
        'categories': [
            {'title': 'Face Serums', 'sub': 'Niacinamide 10%, Salicylic 2% & Vitamin C'},
            {'title': 'Cleansers', 'sub': 'Gentle oat & aquaporin foaming cleansers'},
            {'title': 'Moisturisers', 'sub': 'Ceramides 0.3% & marula oil creams'},
            {'title': 'Sunscreen', 'sub': 'SPF 50 & 60 multi-vitamin sun protection'},
            {'title': 'Haircare', 'sub': 'Maleic bond repair & hair growth actives'},
            {'title': 'All Minimalist Products', 'sub': 'Complete Minimalist active skincare'}
        ]
    },
    {
        'handle': 'garnier',
        'name': 'Garnier',
        'intro': 'Natural beauty powered by active ingredients. Known for Bright Complete Vitamin C skin solutions, Micellar cleansing, and Fructis haircare.',
        'taxonomy': 'Brightening Face Wash & Daily Haircare',
        'categories': [
            {'title': 'Face Wash', 'sub': 'Bright Complete Vitamin C & Pure Active'},
            {'title': 'Skincare', 'sub': 'Micellar cleansing water & sheet masks'},
            {'title': 'Haircare', 'sub': 'Fructis long & strong nourishing shampoo'},
            {'title': 'Hair Colour', 'sub': 'Color Naturals ammonia-free enriched shades'},
            {'title': 'All Garnier Products', 'sub': 'Complete Garnier range'}
        ]
    },
    {
        'handle': 'plix',
        'name': 'Plix',
        'intro': 'Plant-powered beauty and personal care. Delicious fruit actives that treat pigmentation, dullness, and promote natural wellness.',
        'taxonomy': 'Plant-Powered Beauty & Wellness',
        'categories': [
            {'title': 'Skincare', 'sub': 'Guava glow de-pigmentation routines'},
            {'title': 'Face Care', 'sub': 'Pineapple brightening face washes'},
            {'title': 'Haircare', 'sub': 'Rosemary & avocado hair nutrition'},
            {'title': 'Body Care', 'sub': 'Natural fruit active body lotions'},
            {'title': 'All Plix Products', 'sub': 'Complete Plix plant-powered collection'}
        ]
    },
    {
        'handle': 'nivea',
        'name': 'NIVEA',
        'intro': 'Over a century of worldwide trust. Deeply nourishing body milks, iconic blue tin cremes, gentle deodorants, and lip care.',
        'taxonomy': 'Nourishing Body Lotions, Creams & Lip Care',
        'categories': [
            {'title': 'Body Lotion', 'sub': 'Nourishing body milk & aloe hydration'},
            {'title': 'Body Cream', 'sub': 'Iconic NIVEA blue creme & soft cream'},
            {'title': 'Deodorants', 'sub': 'Fresh flower roll-ons & deodorant sprays'},
            {'title': 'Face Care', 'sub': 'Gentle milk cleansers & daily face creams'},
            {'title': 'Lip Care', 'sub': 'Hydro care & fruity shine lip balms'},
            {'title': 'All NIVEA Products', 'sub': 'Complete NIVEA personal care'}
        ]
    },
    {
        'handle': 'ponds',
        'name': "POND'S",
        'intro': 'Trusted across generations for radiant, glowing skin. Pioneer of Cold Cream, Super Light Gel with hyaluronic acid, and detox washes.',
        'taxonomy': 'Daily Face Wash, Creams & Hydration',
        'categories': [
            {'title': 'Face Wash', 'sub': 'Bright Beauty & Pure Detox charcoal washes'},
            {'title': 'Moisturisers', 'sub': 'Super Light Gel with hyaluronic acid'},
            {'title': 'Face Cream', 'sub': 'Classic cold cream & light moisturiser'},
            {'title': 'Serums', 'sub': 'Spotless glow brightening booster serums'},
            {'title': "All POND'S Products", 'sub': "Complete POND'S skincare range"}
        ]
    },
    {
        'handle': 'dot-and-key',
        'name': 'Dot & Key',
        'intro': 'Playful, dermatologically formulated skincare packed with juicy fruit nutrients, barrier-strengthening ceramides, and SPF 50+.',
        'taxonomy': 'Hydrating Skincare, Sunscreens & Serums',
        'categories': [
            {'title': 'Face Wash', 'sub': 'Watermelon, Cica & Vitamin C cleansers'},
            {'title': 'Moisturisers', 'sub': '72HR hydrating gel & ceramide creams'},
            {'title': 'Serums', 'sub': 'Barrier repair & de-pigmentation drops'},
            {'title': 'Sunscreen', 'sub': 'Watermelon cooling & Vitamin C fluid SPF 50'},
            {'title': 'Lip Care', 'sub': 'Gloss boss tinted & peptide lip balms'},
            {'title': 'Body Care', 'sub': 'Exfoliating AHA BHA body lotions'},
            {'title': 'All Dot & Key Products', 'sub': 'Complete Dot & Key skincare'}
        ]
    },
    {
        'handle': 'vega',
        'name': 'VEGA',
        'intro': "India's leading brand in head-to-toe personal grooming tools, hair styling appliances, handcrafted combs, and makeup brushes.",
        'taxonomy': 'Hair Brushes, Styling Tools & Grooming Appliances',
        'categories': [
            {'title': 'Hair Brushes', 'sub': 'Cushion, paddle & round wooden styling brushes'},
            {'title': 'Combs', 'sub': 'Handmade cellulose acetate & dressing combs'},
            {'title': 'Hair Dryers', 'sub': 'Salon dry 1200W - 2000W professional dryers'},
            {'title': 'Hair Straighteners', 'sub': 'Ceramic & keratin infused plate straighteners'},
            {'title': 'Hair Styling Tools', 'sub': 'Curling barrels, crimpers & 3-in-1 stylers'},
            {'title': 'Grooming Tools', 'sub': 'Manicure, pedicure & precision tweezers'},
            {'title': 'All VEGA Products', 'sub': 'Complete VEGA grooming accessories'}
        ]
    },
    {
        'handle': 'philips',
        'name': 'Philips',
        'intro': 'World leader in personal grooming technology. Precision beard trimmers, multi-grooming kits, shavers, and protective hair styling.',
        'taxonomy': "Men's Grooming Trimmers & Styling Appliances",
        'categories': [
            {'title': 'Trimmers', 'sub': 'Beard trimmers with self-sharpening blades'},
            {'title': "Men's Grooming", 'sub': 'Multi-grooming kits, shavers & body groomers'},
            {'title': 'Hair Styling Appliances', 'sub': 'ThermoProtect hair dryers & straighteners'},
            {'title': 'Electric Grooming Products', 'sub': 'Cordless precision styling appliances'},
            {'title': 'All Philips Products', 'sub': 'Complete Philips grooming collection'}
        ]
    },
    {
        'handle': 'ghar-soaps',
        'name': 'Ghar Soaps',
        'intro': 'Handcrafted artisan soaps formulated with authentic natural ingredients, cold-pressed oils, saffron, and fresh goat milk.',
        'taxonomy': 'Authentic Handcrafted Personal Care Soaps',
        'categories': [
            {'title': 'Handcrafted Soaps', 'sub': 'Magic soaps & saffron goat milk bars'},
            {'title': 'Body Care', 'sub': 'Natural body wash & bath scrubs'},
            {'title': 'All Ghar Soaps Products', 'sub': 'Complete Ghar Soaps collection'}
        ]
    }
]

created = 0
for b in brands:
    handle = b['handle']
    filename = os.path.join('templates', f'page.brand-{handle}.json')
    
    blocks = {}
    order = []
    
    for i, cat in enumerate(b['categories'], 1):
        block_id = f'cat-{i}'
        blocks[block_id] = {
            'type': 'category',
            'settings': {
                'enabled': True,
                'title': cat['title'],
                'sub': cat['sub']
            }
        }
        order.append(block_id)
        
    template_data = {
        'sections': {
            'hero': {
                'type': 'brand-hero',
                'settings': {
                    'eyebrow': 'Brand Spotlight',
                    'brand_name': b['name'],
                    'taxonomy_note': b['taxonomy'],
                    'description': f'<p>{b["intro"]}</p>',
                    'cta_label': 'Explore Categories',
                    'cta_link': '#brand-categories',
                    'secondary_cta_label': 'View All Products',
                    'secondary_cta_link': '#brand-products'
                }
            },
            'categories': {
                'type': 'brand-categories',
                'settings': {
                    'eyebrow': 'Shop by category',
                    'heading': f"{b['name']} Categories",
                    'subheading': f"Select a category to browse verified {b['name']} products."
                },
                'blocks': blocks,
                'block_order': order
            },
            'products': {
                'type': 'brand-products',
                'settings': {
                    'eyebrow': 'Selected Products',
                    'heading': f"Featured {b['name']} Products",
                    'products_to_show': 8,
                    'columns_desktop': 4,
                    'show_vendor': False,
                    'show_view_all': True,
                    'view_all_label': f"Shop All {b['name']} Products"
                }
            },
            'story': {
                'type': 'brand-story',
                'settings': {
                    'eyebrow': 'Authenticity & Promise',
                    'heading': f"Genuine {b['name']} at Mahadev",
                    'text': f"<p>At Mahadev Cutlery & Gift Articles, every {b['name']} product is 100% genuine, sourced directly from authorized distribution channels in Ahmedabad. We guarantee original quality, verified batch codes, and dedicated category organization.</p>"
                },
                'blocks': {
                    'promise-1': {
                        'type': 'promise',
                        'settings': {
                            'title': '100% Genuine Guarantee',
                            'text': f"Directly sourced from authorized {b['name']} distributors."
                        }
                    },
                    'promise-2': {
                        'type': 'promise',
                        'settings': {
                            'title': 'Ahmedabad Store Pickup',
                            'text': 'Available at our local retail store with personal sizing guidance.'
                        }
                    },
                    'promise-3': {
                        'type': 'promise',
                        'settings': {
                            'title': 'Dedicated Brand Categories',
                            'text': 'Only relevant products appear in each category — no mixed stock.'
                        }
                    }
                },
                'block_order': ['promise-1', 'promise-2', 'promise-3']
            }
        },
        'order': ['hero', 'categories', 'products', 'story']
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(template_data, f, indent=2, ensure_ascii=False)
    created += 1

print(f'Successfully generated {created} brand templates in templates/!')
