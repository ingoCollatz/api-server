import {AggregateSource} from "../aggregateSource";
import {ContactDirection, Contact2, ContactPoint, Contacts, CrcTrust, ProfileAggregate} from "../../types";
import {getPool} from "../../resolvers/resolvers";
import {prisma_api_ro} from "../../apiDbClient";

async function trustContacts(forSafeAddress: string) : Promise<Contact2[]> {
  const pool = getPool();
  try {
    const trustContactsResult = await pool.query(`
                with "out" as (
                    select max(timestamp) last_contact_at, array_agg("limit") as limits, address
                    from crc_trust_2
                    where can_send_to = $1
                    group by address
                ), "in" as (
                    select max(timestamp) last_contact_at, array_agg("limit") as limits, can_send_to
                    from crc_trust_2
                    where address = $1
                    group by can_send_to
                ), "all" as (
                    select 'out' direction, * from "out"
                    union all
                    select 'in' direction, * from "in"
                )
                select array_agg(direction) as directions,
                       array_agg(limits[array_upper(limits, 1)]) as limits,
                       array_agg(last_contact_at) timestamps,
                       address as contact_address
                from "all"
                group by address;`,
      [forSafeAddress.toLowerCase()]);

    return trustContactsResult.rows.map(o => {
      const timestamps = o.timestamps.map((p:any) => new Date(p).getTime().toString());
      const lastContactAt = timestamps.reduce((p:any, c:any) => Math.max(p, parseInt(c)), 0);
      return <Contact2> {
        metadata: [<ContactPoint>{
            name: "CrcTrust",
            directions: o.directions.map((p:string) => p == "in" ? ContactDirection.In : ContactDirection.Out),
            values: o.limits.map((p:any) => p.toString()),
            timestamps: timestamps
        }],
        contactAddress: o.contact_address,
        lastContactAt: lastContactAt
      };
    })
  } finally {
    await pool.end();
  }
}

async function hubTransferContacts(forSafeAddress: string) : Promise<Contact2[]> {
  const pool = getPool();
  try {
    const hubTransferContactsResult = await pool.query(`
                with "out" as (
                    select max(timestamp) last_contact_at, "to" as contact_address
                    from crc_hub_transfer_2
                    where "from" = $1
                    group by "to"
                ), "out_with_value" as (
                    select "out".*, ct.value
                    from crc_hub_transfer_2 ct
                    join "out" on ct."to" = "out".contact_address and ct.timestamp = "out".last_contact_at
                ), "in" as (
                    select max(timestamp) last_contact_at, "from" as contact_address
                    from crc_hub_transfer_2
                    where "to" = $1
                    group by "from"
                ), "in_with_value" as (
                    select "in".*, ct.value
                    from crc_hub_transfer_2 ct
                    join "in" on ct."from" = "in".contact_address and ct.timestamp = "in".last_contact_at
                ), "all" as (
                    select 'out' direction, *
                    from "out_with_value"
                    union all
                    select 'in' direction, *
                    from "in_with_value"
                )
                select array_agg(direction) as directions,
                       array_agg(value) as values,
                       array_agg(last_contact_at) as timestamps,
                       contact_address
                from "all"
                group by contact_address;`,
      [forSafeAddress.toLowerCase()]);

    return hubTransferContactsResult.rows.map(o => {
      const timestamps = o.timestamps.map((p:any) => new Date(p).getTime().toString());
      const lastContactAt = timestamps.reduce((p:any, c:any) => Math.max(p, parseInt(c)), 0);
      return <Contact2> {
        metadata: [<ContactPoint>{
          name: "CrcHubTransfer",
          directions: o.directions.map((p:string) => p == "in" ? ContactDirection.In : ContactDirection.Out),
          values: o.values,
          timestamps: timestamps
        }],
        contactAddress: o.contact_address,
        lastContactAt: lastContactAt
      };
    })
  } finally {
    await pool.end();
  }
}

async function chatMessageContacts(forSafeAddress: string) : Promise<Contact2[]> {
  const chatContactsResult = await prisma_api_ro.$queryRaw`
      with "in" as (
          select max("createdAt") last_contact_at, "from" as contact_address
          from "ChatMessage"
          where "to" = ${forSafeAddress}
          group by "from"
      ), "in_with_text" as (
          select "in".*, cm.text as value
          from "in"
                   join "ChatMessage" cm on cm."createdAt" = "in".last_contact_at and cm.from = "in".contact_address
      ), "out" as (
          select max("createdAt") last_contact_at, "to" as contact_address
          from "ChatMessage"
          where "from" = ${forSafeAddress}
          group by "to"
      ), "out_with_text" as (
          select "out".*, cm.text as value
          from "out"
                   join "ChatMessage" cm on cm."createdAt" = "out".last_contact_at and cm.to = "out".contact_address
      ),"all" as (
          select 'out' direction, *
          from "out_with_text"
          union all
          select 'in' direction, *
          from "in_with_text"
      ), "all_directions" as (
          select array_agg(direction) as directions,
                 array_agg(value) as values,
                 array_agg(last_contact_at) as timestamps,
                 contact_address
          from "all"
          group by contact_address
      )
      select *
      from "all_directions";`;

  return chatContactsResult.map((o:any) => {
    const timestamps = o.timestamps.map((p:any) => new Date(p).getTime().toString());
    const lastContactAt = timestamps.reduce((p:any, c:any) => Math.max(p, parseInt(c)), 0);
    return <Contact2> {
      metadata: [<ContactPoint>{
        name: "ChatMessage",
        directions: o.directions.map((p:string) => p == "in" ? ContactDirection.In : ContactDirection.Out),
        values: o.values,
        timestamps: timestamps
      }],
      contactAddress: o.contact_address,
      lastContactAt: lastContactAt
    };
  })
}

// People who claimed my invitations
// The person from which I claimed my invitation
async function invitationContacts(forSafeAddress: string) : Promise<Contact2[]> {
  const invitationContactsResult = await prisma_api_ro.$queryRaw`
      with "in" as (
          select max(i."createdAt") last_contact_at, "creatorProfile"."circlesAddress" as contact_address
          from "Invitation" i
                   join "Profile" "claimedByProfile" on "claimedByProfile".id = i."claimedByProfileId"
                   join "Profile" "creatorProfile" on "creatorProfile".id = i."createdByProfileId"
          where "claimedByProfile"."circlesAddress" = ${forSafeAddress.toLowerCase()}
          group by "creatorProfile"."circlesAddress"
      ), "out" as (
          select max(i."claimedAt") last_contact_at, "claimedByProfile"."circlesAddress" as contact_address
          from "Invitation" i
                   join "Profile" "creatorProfile" on "creatorProfile".id = i."createdByProfileId"
                   join "Profile" "claimedByProfile" on "claimedByProfile".id = i."claimedByProfileId"
          where "creatorProfile"."circlesAddress" = ${forSafeAddress.toLowerCase()}
            and "claimedByProfile"."circlesAddress" is not null
          group by "claimedByProfile"."circlesAddress"
      ), "all" as (
          select 'out' direction, *
          from "out"
          union all
          select 'in' direction, *
          from "in"
      )
      select array_agg(direction) as directions,
             array_agg(last_contact_at) as timestamps,
             contact_address
      from "all"
      group by contact_address`;

  return invitationContactsResult.map((o:any) => {
    const timestamps = o.timestamps.map((p:any) => new Date(p).getTime().toString());
    const lastContactAt = timestamps.reduce((p:any, c:any) => Math.max(p, parseInt(c)), 0);
    return <Contact2> {
      metadata: [<ContactPoint>{
        name: "Invitation",
        directions: o.directions.map((p:string) => p == "in" ? ContactDirection.In : ContactDirection.Out),
        values: [],
        timestamps: timestamps
      }],
      contactAddress: o.contact_address,
      lastContactAt: lastContactAt
    };
  })
}

// People who offered me (non-rejected) orga-invitations
// People I offered orga invitations to
async function membershipOfferContacts(forSafeAddress: string) : Promise<Contact2[]> {
  const membershipOfferContactsResult = await prisma_api_ro.$queryRaw`
      with "in" as (
          select max(m."createdAt") as last_contact_at, "createdByProfile"."circlesAddress" as contact_address
          from "Membership" m
                   join "Profile" "memberProfile" on "memberProfile".id = m."memberId"
                   join "Profile" "createdByProfile" on "createdByProfile".id = m."createdByProfileId"
          where "rejectedAt" is null
            and "memberProfile"."circlesAddress" = ${forSafeAddress.toLowerCase()}
          group by "createdByProfile"."circlesAddress"
      ), "out" as (
          select max(m."createdAt") as last_contact_at, "memberProfile"."circlesAddress" as contact_address
          from "Membership" m
                   join "Profile" "memberProfile" on "memberProfile".id = m."memberId"
                   join "Profile" "createdByProfile" on "createdByProfile".id = m."createdByProfileId"
          where "createdByProfile"."circlesAddress" = ${forSafeAddress.toLowerCase()}
          group by "memberProfile"."circlesAddress"
      ), "in_with_member_at" as (
          select "in".*, memberAtProfile."circlesAddress" as value
          from "in"
                   join "Profile" memberProfile on memberProfile."circlesAddress" = "in".contact_address
                   join "Membership" m on m."memberId" = memberProfile.id and m."createdAt" = "in".last_contact_at
                   join "Profile" memberAtProfile on memberAtProfile.id = m."memberAtId"
      ), "out_with_member_at" as (
          select "out".*, memberAtProfile."circlesAddress" as value
          from "out"
                   join "Profile" memberProfile on memberProfile."circlesAddress" = "out".contact_address
                   join "Membership" m on m."memberId" = memberProfile.id and m."createdAt" = "out".last_contact_at
                   join "Profile" memberAtProfile on memberAtProfile.id = m."memberAtId"
      ), "all" as (
          select 'out' direction, *
          from "out_with_member_at"
          union all
          select 'in' direction, *
          from "in_with_member_at"
      )
      select array_agg(direction) as directions,
             array_agg(last_contact_at) as timestamps,
             array_agg(value) as values,
             contact_address
      from "all"
      group by contact_address;`;

  return membershipOfferContactsResult.map((o:any) => {
    const timestamps = o.timestamps.map((p:any) => new Date(p).getTime().toString());
    const lastContactAt = timestamps.reduce((p:any, c:any) => Math.max(p, parseInt(c)), 0);
    return <Contact2> {
      metadata: [<ContactPoint>{
        name: "MembershipOffer",
        directions: o.directions.map((p:string) => p == "in" ? ContactDirection.In : ContactDirection.Out),
        values: o.values,
        timestamps: timestamps
      }],
      contactAddress: o.contact_address,
      lastContactAt: lastContactAt
    };
  })
}

export enum ContactPoints {
  CrcTrust = "CrcTrust",
  CrcHubTransfer = "CrcHubTransfer",
  ChatMessage = "ChatMessage",
  Invitation = "Invitation",
  MembershipOffer = "MembershipOffer",
}

export class ContactsSource implements AggregateSource {
  private readonly _contactPoints:ContactPoints[];
  constructor(contactPoints:ContactPoints[]) {
    this._contactPoints = contactPoints;
  }
  async getAggregate(forSafeAddress: string): Promise<ProfileAggregate[]> {
    const types = this._contactPoints?.reduce((p, c) => {
      if (!c) return p;
      p[c] = true;
      return p;
    }, <{ [x: string]: any }>{}) ?? {};

    const contactSources: Promise<Contact2[]>[] = [];
    if (types["CrcTrust"]) {
      contactSources.push(trustContacts(forSafeAddress));
    }
    if (types["CrcHubTransfer"]) {
      contactSources.push(hubTransferContacts(forSafeAddress));
    }
    if (types["ChatMessage"]) {
      contactSources.push(chatMessageContacts(forSafeAddress));
    }
    if (types["Invitation"]) {
      contactSources.push(invitationContacts(forSafeAddress));
    }
    if (types["MembershipOffer"]) {
      contactSources.push(membershipOfferContacts(forSafeAddress));
    }

    const results = await Promise.all(contactSources);
    let latestEventAt:number = -1;

    const contactPoints = results.flatMap(o => o);
    const distinctAddresses = contactPoints.reduce((p,c) => {
      if (!p[c.contactAddress]) {
        p[c.contactAddress] = c;
      } else {
        const cTime = !isNaN(parseInt(c.lastContactAt)) ? parseInt(c.lastContactAt) : new Date(c.lastContactAt).getTime();
        latestEventAt = cTime > latestEventAt ? cTime : latestEventAt;

        const stored = p[c.contactAddress];
        const sTime = !isNaN(parseInt(stored.lastContactAt)) ? parseInt(stored.lastContactAt) : new Date(stored.lastContactAt).getTime();

        p[c.contactAddress] = {
          ...c,
          metadata: [...stored.metadata, ...c.metadata],
          lastContactAt: (cTime > sTime ? cTime : sTime).toString()
        };
      }
      return p;
    }, <{ [x: string]:Contact2 }>{});

    return [{
      safe_address: forSafeAddress,
      type: "Contacts",
      payload: <Contacts> {
        __typename: "Contacts",
        lastUpdatedAt: latestEventAt.toString(),
        contacts: Object.values(distinctAddresses)
      }
    }]
  }
}