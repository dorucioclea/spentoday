# Technical requirements

Navigation:

- [Auth](#auth)
- [Business](#business)
- [AI](#ai)
- [Analytics](#analytics)

## Auth

Auth should be as easy as possible for user.

That's why we should support sign in with external providers as well as password. External providers allways are prefered way, because you don't need to remember password.

I think we should also make it inside of modal. Because redirecting user to another page makes user less comfortable.

All users are registered same way, customer or business owner doesn't matter.
We keep one auth system for all shops inside the platform.

## Business

- [Isolated page](#isolated-page)
- [Pricing](#pricing)
- [Products](#products)
- [Shop customization](#shop-customization)
- [Approving](#approving)

From business side we want to create shop and earn more money from it than we spend on it (basic stuff). Actually we want to earn more money in comparison with other places to do it (local shop, other platforms) in relation to the spent resources.
Super basically:

spentoday income / time and money > other place income / time and money

So we should make speed of setting up store better, it leads to better ui.

### Isolated page

When business share link to their shop, they often don't want users to be able to buy somewhere else. Which is possible if we show them full platform (our navbar, back to other shops). So we need to create separate pages for internal and external mods of shop.

### Pricing

Trial plan is nessasary to give opportunity to try service. But it should be limited, because we need to gain money. Ideas for current stage:

|           | Trial | Pro  | Business  |
| --------- | ----- | ---- | --------- |
| Price     | 0 $   | 25 $ | 100 $     |
| Support   | q&a   | 24/7 | 24/7      |
| Products  | 3     | 1000 | unlimited |
| Workers   | 2     | 10   | unlimited |
| Analytics | no    | full | full      |

### Products

Product description should contain markdown to make good experience with rich editor.

Support of `generic properties` for selected category is extrimely important. They allow to filter all products inside category with similar criteries, like processor for notebook. But all generic properties should be **added** or **approved** by admins of platform.

`Custom properties` are unique for each product. Products can't be filtered by custome properties. We can move custome property into generic property if more than 25% of products in category use it, but it's really expensive.

Question: should we support `generic properties` inside one store, but outside they are custom properties.

According to product images to keep design clean:

- or define same image ratio for all products (4:3 for example)
- or we show them as Pinterest do it: in columns, not in rows

As addition we can add video support, but from youtube, because storing video on our servers is quite expensive.

### Shop customization

That's where ways between providing isolated shop and central platform go in different ways.
I think it's better to watch at Spentoday as shopping center in real life.
If we look at shopping centers, they have own design,
but each shop inside have different customization.

So Spentoday will provide small set of customization of our main design.
For example: main color of shop, banner of shop.

### Approving

Approving shops is essential to keep only good shops inside of the platform.
We want to remove all trash products. But keep approving process fast and super easy.
[Paddle payment service](https://www.paddle.com) has complicated approving process as for me.
So we need simple, not annoying and resonable system.

Propositions:

- approving first 3 products by admins of platform (i propose amount available in trial plan)
- check for bad words in description, name
- reapproving shop if a lot of bad reviews are sent (in comparison to good ones)

## AI

Maybe to be in step with modernity we can use AI. Some examples:

- search where you just describe what you want and AI gives you exact filters, sorting and text search
- creation of description and properties for products, AI really simplify the process and save time
- generation of shop branding

## Analytics

Analytics should be anabled for platform itself and for each store. Business wants to see numbers and we also.
