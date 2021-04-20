import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddCirclesTokenInput = {
  address: Scalars['String'];
  ownerAddress: Scalars['String'];
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
};

export type AddCirclesTokenTransferInput = {
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subjectAddress: Scalars['String'];
  predicate: CirclesTokenTransferPredicate;
  objectAddress: Scalars['String'];
  transferredToken: Scalars['String'];
  value: Scalars['String'];
};

export type AddCirclesTrustRelationInput = {
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subjectAddress: Scalars['String'];
  predicate: CirclesTrustRelationPredicate;
  objectAddress: Scalars['String'];
  weight: Scalars['Int'];
};

export type AddCirclesWalletInput = {
  address: Scalars['String'];
  ownToken?: Maybe<AddCirclesTokenInput>;
};

export type CirclesToken = {
  __typename?: 'CirclesToken';
  address: Scalars['String'];
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  owner?: Maybe<CirclesWallet>;
  transfers?: Maybe<Array<CirclesTokenTransfer>>;
};

export type CirclesTokenTransfer = {
  __typename?: 'CirclesTokenTransfer';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subject: CirclesWallet;
  predicate: CirclesTokenTransferPredicate;
  object: CirclesWallet;
  value: Scalars['String'];
};

export enum CirclesTokenTransferPredicate {
  GivingTo = 'GIVING_TO',
  ReceivingFrom = 'RECEIVING_FROM'
}

export type CirclesTrustRelation = {
  __typename?: 'CirclesTrustRelation';
  id: Scalars['Int'];
  createdAt?: Maybe<Scalars['String']>;
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subject: CirclesWallet;
  predicate: CirclesTrustRelationPredicate;
  object: CirclesWallet;
  weight: Scalars['Int'];
};

export enum CirclesTrustRelationPredicate {
  GivingTo = 'GIVING_TO',
  ReceivingFrom = 'RECEIVING_FROM'
}

export type CirclesWallet = {
  __typename?: 'CirclesWallet';
  address: Scalars['String'];
  ownToken?: Maybe<CirclesToken>;
  tokens?: Maybe<Array<CirclesToken>>;
  transfers?: Maybe<Array<CirclesTokenTransfer>>;
  trustRelations?: Maybe<Array<CirclesTrustRelation>>;
};

export type ConsumeDepositedChallengeResponse = {
  __typename?: 'ConsumeDepositedChallengeResponse';
  success: Scalars['Boolean'];
  challenge?: Maybe<Scalars['String']>;
};

export type DelegateAuthInit = {
  __typename?: 'DelegateAuthInit';
  appId: Scalars['String'];
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  challengeType?: Maybe<Scalars['String']>;
  delegateAuthCode?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type DepositChallenge = {
  jwt: Scalars['String'];
};

export type DepositChallengeResponse = {
  __typename?: 'DepositChallengeResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  exchangeToken: ExchangeTokenResponse;
  authenticateAt: DelegateAuthInit;
  depositChallenge: DepositChallengeResponse;
  consumeDepositedChallenge: ConsumeDepositedChallengeResponse;
  logout: LogoutResponse;
  upsertProfile: Profile;
  addCirclesWallet: CirclesWallet;
  addCirclesToken: CirclesToken;
  addCirclesTrustRelation: CirclesTrustRelation;
  addCirclesTokenTransfer: CirclesTokenTransfer;
};


export type MutationAuthenticateAtArgs = {
  appId: Scalars['String'];
};


export type MutationDepositChallengeArgs = {
  jwt: Scalars['String'];
};


export type MutationConsumeDepositedChallengeArgs = {
  delegateAuthCode: Scalars['String'];
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};


export type MutationAddCirclesWalletArgs = {
  data: AddCirclesWalletInput;
};


export type MutationAddCirclesTokenArgs = {
  data: AddCirclesTokenInput;
};


export type MutationAddCirclesTrustRelationArgs = {
  data: AddCirclesTrustRelationInput;
};


export type MutationAddCirclesTokenTransferArgs = {
  data: AddCirclesTokenTransferInput;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['Int'];
  circlesAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  dream: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  version: Version;
  sessionInfo: SessionInfo;
  profiles: Array<Profile>;
  circlesWallets: Array<CirclesWallet>;
};


export type QueryProfilesArgs = {
  query: QueryProfileInput;
};


export type QueryCirclesWalletsArgs = {
  query: QueryCirclesWalletInput;
};

export type QueryCirclesWalletInput = {
  address?: Maybe<Scalars['String']>;
  ownTokenAddress?: Maybe<Scalars['String']>;
  trusts?: Maybe<Scalars['String']>;
  isTrustedBy?: Maybe<Scalars['String']>;
};

export type QueryProfileInput = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
};

export type QueryUniqueProfileInput = {
  id: Scalars['Int'];
};

export type Server = {
  __typename?: 'Server';
  version: Scalars['String'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  isLoggedOn: Scalars['Boolean'];
  hasProfile?: Maybe<Scalars['Boolean']>;
  profileId?: Maybe<Scalars['Int']>;
};

export type UpsertProfileInput = {
  id?: Maybe<Scalars['Int']>;
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  dream: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddCirclesTokenInput: AddCirclesTokenInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  AddCirclesTokenTransferInput: AddCirclesTokenTransferInput;
  AddCirclesTrustRelationInput: AddCirclesTrustRelationInput;
  AddCirclesWalletInput: AddCirclesWalletInput;
  CirclesToken: ResolverTypeWrapper<CirclesToken>;
  CirclesTokenTransfer: ResolverTypeWrapper<CirclesTokenTransfer>;
  CirclesTokenTransferPredicate: CirclesTokenTransferPredicate;
  CirclesTrustRelation: ResolverTypeWrapper<CirclesTrustRelation>;
  CirclesTrustRelationPredicate: CirclesTrustRelationPredicate;
  CirclesWallet: ResolverTypeWrapper<CirclesWallet>;
  ConsumeDepositedChallengeResponse: ResolverTypeWrapper<ConsumeDepositedChallengeResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DelegateAuthInit: ResolverTypeWrapper<DelegateAuthInit>;
  DepositChallenge: DepositChallenge;
  DepositChallengeResponse: ResolverTypeWrapper<DepositChallengeResponse>;
  ExchangeTokenResponse: ResolverTypeWrapper<ExchangeTokenResponse>;
  LogoutResponse: ResolverTypeWrapper<LogoutResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<{}>;
  QueryCirclesWalletInput: QueryCirclesWalletInput;
  QueryProfileInput: QueryProfileInput;
  QueryUniqueProfileInput: QueryUniqueProfileInput;
  Server: ResolverTypeWrapper<Server>;
  SessionInfo: ResolverTypeWrapper<SessionInfo>;
  UpsertProfileInput: UpsertProfileInput;
  Version: ResolverTypeWrapper<Version>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddCirclesTokenInput: AddCirclesTokenInput;
  String: Scalars['String'];
  Int: Scalars['Int'];
  AddCirclesTokenTransferInput: AddCirclesTokenTransferInput;
  AddCirclesTrustRelationInput: AddCirclesTrustRelationInput;
  AddCirclesWalletInput: AddCirclesWalletInput;
  CirclesToken: CirclesToken;
  CirclesTokenTransfer: CirclesTokenTransfer;
  CirclesTrustRelation: CirclesTrustRelation;
  CirclesWallet: CirclesWallet;
  ConsumeDepositedChallengeResponse: ConsumeDepositedChallengeResponse;
  Boolean: Scalars['Boolean'];
  DelegateAuthInit: DelegateAuthInit;
  DepositChallenge: DepositChallenge;
  DepositChallengeResponse: DepositChallengeResponse;
  ExchangeTokenResponse: ExchangeTokenResponse;
  LogoutResponse: LogoutResponse;
  Mutation: {};
  Profile: Profile;
  Query: {};
  QueryCirclesWalletInput: QueryCirclesWalletInput;
  QueryProfileInput: QueryProfileInput;
  QueryUniqueProfileInput: QueryUniqueProfileInput;
  Server: Server;
  SessionInfo: SessionInfo;
  UpsertProfileInput: UpsertProfileInput;
  Version: Version;
}>;

export type CirclesTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesToken'] = ResolversParentTypes['CirclesToken']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdInBlockNo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdInBlockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['CirclesWallet']>, ParentType, ContextType>;
  transfers?: Resolver<Maybe<Array<ResolversTypes['CirclesTokenTransfer']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesTokenTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesTokenTransfer'] = ResolversParentTypes['CirclesTokenTransfer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdInBlockNo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdInBlockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['CirclesTokenTransferPredicate'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesTrustRelationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesTrustRelation'] = ResolversParentTypes['CirclesTrustRelation']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdInBlockNo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdInBlockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['CirclesTrustRelationPredicate'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesWalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesWallet'] = ResolversParentTypes['CirclesWallet']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownToken?: Resolver<Maybe<ResolversTypes['CirclesToken']>, ParentType, ContextType>;
  tokens?: Resolver<Maybe<Array<ResolversTypes['CirclesToken']>>, ParentType, ContextType>;
  transfers?: Resolver<Maybe<Array<ResolversTypes['CirclesTokenTransfer']>>, ParentType, ContextType>;
  trustRelations?: Resolver<Maybe<Array<ResolversTypes['CirclesTrustRelation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConsumeDepositedChallengeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConsumeDepositedChallengeResponse'] = ResolversParentTypes['ConsumeDepositedChallengeResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  challenge?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DelegateAuthInitResolvers<ContextType = any, ParentType extends ResolversParentTypes['DelegateAuthInit'] = ResolversParentTypes['DelegateAuthInit']> = ResolversObject<{
  appId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  challengeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  delegateAuthCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  validTo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DepositChallengeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DepositChallengeResponse'] = ResolversParentTypes['DepositChallengeResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExchangeTokenResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExchangeTokenResponse'] = ResolversParentTypes['ExchangeTokenResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogoutResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogoutResponse'] = ResolversParentTypes['LogoutResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  exchangeToken?: Resolver<ResolversTypes['ExchangeTokenResponse'], ParentType, ContextType>;
  authenticateAt?: Resolver<ResolversTypes['DelegateAuthInit'], ParentType, ContextType, RequireFields<MutationAuthenticateAtArgs, 'appId'>>;
  depositChallenge?: Resolver<ResolversTypes['DepositChallengeResponse'], ParentType, ContextType, RequireFields<MutationDepositChallengeArgs, 'jwt'>>;
  consumeDepositedChallenge?: Resolver<ResolversTypes['ConsumeDepositedChallengeResponse'], ParentType, ContextType, RequireFields<MutationConsumeDepositedChallengeArgs, 'delegateAuthCode'>>;
  logout?: Resolver<ResolversTypes['LogoutResponse'], ParentType, ContextType>;
  upsertProfile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType, RequireFields<MutationUpsertProfileArgs, 'data'>>;
  addCirclesWallet?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType, RequireFields<MutationAddCirclesWalletArgs, 'data'>>;
  addCirclesToken?: Resolver<ResolversTypes['CirclesToken'], ParentType, ContextType, RequireFields<MutationAddCirclesTokenArgs, 'data'>>;
  addCirclesTrustRelation?: Resolver<ResolversTypes['CirclesTrustRelation'], ParentType, ContextType, RequireFields<MutationAddCirclesTrustRelationArgs, 'data'>>;
  addCirclesTokenTransfer?: Resolver<ResolversTypes['CirclesTokenTransfer'], ParentType, ContextType, RequireFields<MutationAddCirclesTokenTransferArgs, 'data'>>;
}>;

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  circlesAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dream?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarCid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarMimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  version?: Resolver<ResolversTypes['Version'], ParentType, ContextType>;
  sessionInfo?: Resolver<ResolversTypes['SessionInfo'], ParentType, ContextType>;
  profiles?: Resolver<Array<ResolversTypes['Profile']>, ParentType, ContextType, RequireFields<QueryProfilesArgs, 'query'>>;
  circlesWallets?: Resolver<Array<ResolversTypes['CirclesWallet']>, ParentType, ContextType, RequireFields<QueryCirclesWalletsArgs, 'query'>>;
}>;

export type ServerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Server'] = ResolversParentTypes['Server']> = ResolversObject<{
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionInfo'] = ResolversParentTypes['SessionInfo']> = ResolversObject<{
  isLoggedOn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasProfile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  profileId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = ResolversObject<{
  major?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minor?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CirclesToken?: CirclesTokenResolvers<ContextType>;
  CirclesTokenTransfer?: CirclesTokenTransferResolvers<ContextType>;
  CirclesTrustRelation?: CirclesTrustRelationResolvers<ContextType>;
  CirclesWallet?: CirclesWalletResolvers<ContextType>;
  ConsumeDepositedChallengeResponse?: ConsumeDepositedChallengeResponseResolvers<ContextType>;
  DelegateAuthInit?: DelegateAuthInitResolvers<ContextType>;
  DepositChallengeResponse?: DepositChallengeResponseResolvers<ContextType>;
  ExchangeTokenResponse?: ExchangeTokenResponseResolvers<ContextType>;
  LogoutResponse?: LogoutResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Server?: ServerResolvers<ContextType>;
  SessionInfo?: SessionInfoResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
