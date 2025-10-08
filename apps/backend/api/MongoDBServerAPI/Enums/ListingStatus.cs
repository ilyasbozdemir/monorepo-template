namespace MongoDBServerAPI.Enums;

public enum ListingStatus
{
    Active,
    Inactive,
    Draft,
    Pending,
    AwaitingApproval,
    Sold,
    Expired,
    Rejected,
    Removed
}

public enum ListingType
{
    Sale,
    Rent,
    Auction,
    Lease,
    Exchange,
    Service,
    DailyRent,
    Other
}
