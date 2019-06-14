import React from 'react';

import { storiesOf } from '@storybook/react';

import PostCard from './index';

storiesOf('Post Card', module)
  .add('with some data', () => (
    <PostCard title={"UX in the age of personalization"}
              authorName={"Corbin Crutchley"}
              date={"Jun 13 2019"} tags={["Testing", "Hi there"]}
              excerpt={"This is some demo text don't expect me to do much more than this oh goodness this is a lot of testing hi there"}/>
  ));
