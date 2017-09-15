# Web Home Assignment

Well met, and welcome! Your job is to implement your own version of the iZettle product library. This may seem like a daunting challenge, but not to worry. We've removed most of the cruft and kept just the essential features. Follow the design sketches included in this repository.

## Features
The following features are a must-have for our customers.

1. List, create, update and remove products and variants
2. Input validation when creating and updating products
    - Product name should be present
    - Product price should be present and positive
3. The products should be persisted in some way.

### Design Sketches

A product may or may not have variants. Looking at the design sketches, the _Apple EarPods_ exist in two different variants; _White_ and _Black_. The other 3 products do not have variants.

* Page 1. Showing the initial view of the product library. As Apple EarPods exist in two different variants with different prices, the pricing column show the price span for those variants.

* Page 2. User has clicked on _Apple EarPods_, list has been expaded and all variants are shown.

* Page 3. User has clicked on _Edit_ on the _Apple EarPods_ row. As the product has variants, the _Price_ field for the product itself is disabled.

* Page 4. User has clicked on the _Add product_ button.

### How to build?

1. Create a branch, name it with your name. This is your branch, do whatever you want with it.
2. Build awesome stuff
3. Push your branch to Github
4. Go to Github and create a pull request to master. In the PR comment, tag the iZettlers who will be looking at your PR (e.g write `@marreman, @jalet, @janneh or @emiloberg` in the comment)
5. The iZettlers will take a look at the PR and maybe send some comments
6. We set up a meeting and discuss the code together.

### Tips

* User whatever tools and build with whatever stack you're most comfortable with. This is _not_ an assignment where we want you to show that you're mastering the stack currently being used at iZettle.
* Add/remove/change things if you think that it should be another way.
* Less code is better code
* There's nothing here to "trick you". No "gotchas" or anything.
