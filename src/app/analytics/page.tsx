"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  Eye,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL;

const EVENTS = [
  "product_view",
  "search",
  "category_click",
  "add_to_cart",
  "remove_from_cart",
  "buy_now",
  "wishlist",
  "checkout",
  "payment",
  "purchase",
];

type EventCount = {
  eventName: string;
  count: number;
};

type FunnelStep = {
  step: string;
  count: number;
  conversionRate: number;
};

type Trend = {
  date: string;
  eventName: string;
  count: number;
};

type Product = {
  id: string;
  name: string;
};

type AnalyticsResponse = {
  totalEvents: number;
  events: EventCount[];
};

type FunnelResponse = {
  funnel: FunnelStep[];
};

type TrendsResponse = {
  trends: Trend[];
};

type ActivityEvent = {
  id: string;
  eventId: string;
  eventName: string;
  deviceId: string;
  sessionId: string;
  userId: string | null;
  productId: string | null;
  properties: Record<string, unknown>;
  occurredAt: string;
  createdAt: string;
};

type EventsResponse = {
  events: ActivityEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function AnalyticsPage() {
  const [data, setData] =
    useState<AnalyticsResponse | null>(null);

  const [funnel, setFunnel] =
    useState<FunnelStep[]>([]);

  const [trends, setTrends] =
    useState<Trend[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  // --------------------------------
  // Filters
  // --------------------------------

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [eventName, setEventName] =
    useState("all");

  const [productId, setProductId] =
    useState("all");

  const [guest, setGuest] =
    useState("all");

  const [userId, setUserId] =
    useState("");

  const [deviceId, setDeviceId] =
    useState("");

  // --------------------------------
  // Event timeline
  // --------------------------------

  const [activityEvents, setActivityEvents] =
    useState<ActivityEvent[]>([]);

  const [activityLoading, setActivityLoading] =
    useState(false);

  const [activityError, setActivityError] =
    useState<string | null>(null);

  // --------------------------------
  // Build analytics query
  // --------------------------------

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (from) {
      params.set("from", from);
    }

    if (to) {
      params.set("to", to);
    }

    if (eventName !== "all") {
      params.set("eventName", eventName);
    }

    if (productId !== "all") {
      params.set("productId", productId);
    }

    if (guest !== "all") {
      params.set("guest", guest);
    }

    const query = params.toString();

    return query ? `?${query}` : "";
  }, [
    from,
    to,
    eventName,
    productId,
    guest,
  ]);

  // --------------------------------
  // Build activity query
  // --------------------------------

  const activityQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", "1");
    params.set("limit", "100");

    if (from) {
      params.set("from", from);
    }

    if (to) {
      params.set("to", to);
    }

    if (eventName !== "all") {
      params.set("eventName", eventName);
    }

    if (productId !== "all") {
      params.set("productId", productId);
    }

    if (guest !== "all") {
      params.set("guest", guest);
    }

    if (userId.trim()) {
      params.set("userId", userId.trim());
    }

    if (deviceId.trim()) {
      params.set("deviceId", deviceId.trim());
    }

    return `?${params.toString()}`;
  }, [
    from,
    to,
    eventName,
    productId,
    guest,
    userId,
    deviceId,
  ]);

  // --------------------------------
  // Fetch products
  // --------------------------------

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/products`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products",
          );
        }

        const result = await response.json();

        setProducts(result);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error,
        );
      }
    };

    fetchProducts();
  }, []);

  // --------------------------------
  // Fetch analytics
  // --------------------------------

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      try {
        const [
          eventsResponse,
          funnelResponse,
          trendsResponse,
        ] = await Promise.all([
          fetch(
            `${BACKEND_URL}/api/v1/analytics/events${queryString}`,
            {
              credentials: "include",
            },
          ),

          fetch(
            `${BACKEND_URL}/api/v1/analytics/funnel${queryString}`,
            {
              credentials: "include",
            },
          ),

          fetch(
            `${BACKEND_URL}/api/v1/analytics/trends${queryString}`,
            {
              credentials: "include",
            },
          ),
        ]);

        if (!eventsResponse.ok) {
          throw new Error(
            "Failed to fetch event analytics",
          );
        }

        if (!funnelResponse.ok) {
          throw new Error(
            "Failed to fetch funnel analytics",
          );
        }

        if (!trendsResponse.ok) {
          throw new Error(
            "Failed to fetch trends",
          );
        }

        const [
          eventsData,
          funnelData,
          trendsData,
        ]: [
          AnalyticsResponse,
          FunnelResponse,
          TrendsResponse,
        ] = await Promise.all([
          eventsResponse.json(),
          funnelResponse.json(),
          trendsResponse.json(),
        ]);

        setData(eventsData);

        setFunnel(funnelData.funnel);

        setTrends(trendsData.trends);
      } catch (error) {
        console.error(
          "Analytics error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [queryString]);

  // --------------------------------
  // Fetch activity events
  // --------------------------------

  useEffect(() => {
    const fetchActivityEvents = async () => {
      /*
       * Don't load the complete event table
       * until the user searches by user/device.
       */
      if (
        !userId.trim() &&
        !deviceId.trim()
      ) {
        setActivityEvents([]);
        setActivityError(null);
        return;
      }

      setActivityLoading(true);
      setActivityError(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/events${activityQueryString}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch activity events",
          );
        }

        const result: EventsResponse =
          await response.json();

        setActivityEvents(result.events);
      } catch (error) {
        console.error(
          "Activity events error:",
          error,
        );

        setActivityError(
          error instanceof Error
            ? error.message
            : "Failed to fetch activity events",
        );

        setActivityEvents([]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivityEvents();
  }, [activityQueryString, userId, deviceId]);

  // --------------------------------
  // Reset filters
  // --------------------------------

  const resetFilters = () => {
    setFrom("");
    setTo("");
    setEventName("all");
    setProductId("all");
    setGuest("all");

    setUserId("");
    setDeviceId("");

    setActivityEvents([]);
    setActivityError(null);
  };

  // --------------------------------
  // Trend chart transformation
  // --------------------------------

  const trendData = useMemo(() => {
    const map = new Map<
      string,
      {
        date: string;
        product_view: number;
        add_to_cart: number;
        checkout: number;
        purchase: number;
      }
    >();

    trends.forEach((item) => {
      if (!map.has(item.date)) {
        map.set(item.date, {
          date: item.date,
          product_view: 0,
          add_to_cart: 0,
          checkout: 0,
          purchase: 0,
        });
      }

      const row = map.get(item.date)!;

      if (
        item.eventName === "product_view"
      ) {
        row.product_view = item.count;
      }

      if (
        item.eventName === "add_to_cart"
      ) {
        row.add_to_cart = item.count;
      }

      if (item.eventName === "checkout") {
        row.checkout = item.count;
      }

      if (item.eventName === "purchase") {
        row.purchase = item.count;
      }
    });

    return Array.from(map.values()).map(
      (item) => ({
        ...item,

        date: new Date(
          item.date,
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }),
    );
  }, [trends]);

  // --------------------------------
  // Stats
  // --------------------------------

  const getEventCount = (
    event: string,
  ) => {
    return (
      data?.events.find(
        (item) =>
          item.eventName === event,
      )?.count ?? 0
    );
  };

  const productViews =
    getEventCount("product_view");

  const addToCart =
    getEventCount("add_to_cart");

  const purchases =
    getEventCount("purchase");

  const purchaseRate =
    productViews > 0
      ? (
          (purchases / productViews) *
          100
        ).toFixed(1)
      : "0";

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-muted/30 p-6">
        <div className="mx-auto max-w-7xl">
          Loading analytics...
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Failed to load analytics
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Monitor user activity and conversion
            performance.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* Filters */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Filters
              </CardTitle>

              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {/* From */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  From
                </label>

                <Input
                  type="date"
                  value={from}
                  onChange={(e) =>
                    setFrom(e.target.value)
                  }
                />
              </div>

              {/* To */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  To
                </label>

                <Input
                  type="date"
                  value={to}
                  onChange={(e) =>
                    setTo(e.target.value)
                  }
                />
              </div>

              {/* Event */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Event
                </label>

                <Select
                  value={eventName}
                  onValueChange={(value) =>
                    setEventName(value ?? "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Event" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All Events
                    </SelectItem>

                    {EVENTS.map((event) => (
                      <SelectItem
                        key={event}
                        value={event}
                      >
                        {event.replaceAll(
                          "_",
                          " ",
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Product
                </label>

                <Select
                  value={productId}
                  onValueChange={(val) => setProductId(val as string)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All Products
                    </SelectItem>

                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User type */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  User Type
                </label>

                <Select
                  value={guest}

                  onValueChange={(g) => setGuest(g as string)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="User type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      Everyone
                    </SelectItem>

                    <SelectItem value="true">
                      Guests
                    </SelectItem>

                    <SelectItem value="false">
                      Logged-in
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User ID */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  User ID
                </label>

                <Input
                  placeholder="Enter user ID"
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                />
              </div>

              {/* Device ID */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Device ID
                </label>

                <Input
                  placeholder="Enter device ID"
                  value={deviceId}
                  onChange={(e) =>
                    setDeviceId(e.target.value)
                  }
                />
              </div>
            </div>

            {(from ||
              to ||
              eventName !== "all" ||
              productId !== "all" ||
              guest !== "all" ||
              userId ||
              deviceId) && (
              <div className="mt-4 text-xs text-muted-foreground">
                Active filters applied
              </div>
            )}
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* User / Device Activity Timeline */}
        {/* -------------------------------- */}

        {(userId.trim() ||
          deviceId.trim()) && (
          <Card>
            <CardHeader>
              <CardTitle>
                User Activity Timeline
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Shows guest activity and
                logged-in activity associated
                with the selected user or device.
              </p>
            </CardHeader>

            <CardContent>
              {activityLoading ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Loading activity...
                </div>
              ) : activityError ? (
                <div className="py-10 text-center text-sm text-destructive">
                  {activityError}
                </div>
              ) : activityEvents.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No activity found.
                </div>
              ) : (
                <div className="relative">

                  {/* Vertical line */}

                  <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

                  <div className="space-y-6">
                    {activityEvents.map(
                      (event) => {
                        const isGuest =
                          event.userId === null;

                        return (
                          <div
                            key={event.eventId}
                            className="relative pl-8"
                          >
                            {/* Timeline dot */}

                            <div
                              className={`absolute left-0 top-1.5 h-[19px] w-[19px] rounded-full border-4 border-background ${
                                isGuest
                                  ? "bg-muted-foreground"
                                  : "bg-primary"
                              }`}
                            />

                            <div className="rounded-lg border bg-card p-4">

                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                <div>
                                  <div className="font-medium capitalize">
                                    {event.eventName.replaceAll(
                                      "_",
                                      " ",
                                    )}
                                  </div>

                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {new Date(
                                      event.occurredAt,
                                    ).toLocaleString()}
                                  </div>
                                </div>

                                <span
                                  className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${
                                    isGuest
                                      ? "bg-muted text-muted-foreground"
                                      : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {isGuest
                                    ? "Guest"
                                    : "Logged-in"}
                                </span>
                              </div>

                              <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">

                                <div>
                                  <span className="font-medium text-foreground">
                                    Device:
                                  </span>{" "}
                                  {event.deviceId}
                                </div>

                                <div>
                                  <span className="font-medium text-foreground">
                                    Session:
                                  </span>{" "}
                                  {event.sessionId}
                                </div>

                                <div>
                                  <span className="font-medium text-foreground">
                                    User:
                                  </span>{" "}
                                  {event.userId ??
                                    "Guest"}
                                </div>

                                {event.productId && (
                                  <div>
                                    <span className="font-medium text-foreground">
                                      Product:
                                    </span>{" "}
                                    {event.productId}
                                  </div>
                                )}
                              </div>

                              {Object.keys(
                                event.properties ?? {},
                              ).length > 0 && (
                                <div className="mt-3 rounded-md bg-muted/50 p-3">
                                  <div className="mb-1 text-xs font-medium">
                                    Properties
                                  </div>

                                  <pre className="overflow-x-auto text-xs text-muted-foreground">
                                    {JSON.stringify(
                                      event.properties,
                                      null,
                                      2,
                                    )}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* -------------------------------- */}
        {/* Stats */}
        {/* -------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>

              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {data.totalEvents.toLocaleString()}
              </div>

              <p className="text-xs text-muted-foreground">
                Tracked events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Product Views
              </CardTitle>

              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {productViews.toLocaleString()}
              </div>

              <p className="text-xs text-muted-foreground">
                Product engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Add to Cart
              </CardTitle>

              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {addToCart.toLocaleString()}
              </div>

              <p className="text-xs text-muted-foreground">
                Cart engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Purchase Rate
              </CardTitle>

              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {purchaseRate}%
              </div>

              <p className="text-xs text-muted-foreground">
                Views → purchases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------- */}
        {/* Charts */}
        {/* -------------------------------- */}

        <div className="grid gap-6 lg:grid-cols-7">

          {/* Trends */}

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>
                Event Trends
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Daily activity
              </p>
            </CardHeader>

            <CardContent>
              <div className="h-[320px]">
                {trendData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No trend data
                  </div>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={trendData}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="product_view"
                        name="Product Views"
                        fill="currentColor"
                        fillOpacity={0.1}
                        stroke="currentColor"
                      />

                      <Area
                        type="monotone"
                        dataKey="add_to_cart"
                        name="Add to Cart"
                        fill="currentColor"
                        fillOpacity={0.1}
                        stroke="currentColor"
                      />

                      <Area
                        type="monotone"
                        dataKey="purchase"
                        name="Purchases"
                        fill="currentColor"
                        fillOpacity={0.1}
                        stroke="currentColor"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>
                Event Breakdown
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Events by type
              </p>
            </CardHeader>

            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={data.events}
                    layout="vertical"
                    margin={{
                      left: 20,
                      right: 20,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis type="number" />

                    <YAxis
                      type="category"
                      dataKey="eventName"
                      width={110}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Events"
                      fill="currentColor"
                      radius={[
                        0,
                        4,
                        4,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------- */}
        {/* Funnel */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>
              Conversion Funnel
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Product discovery → purchase
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {funnel.map((item) => (
                <div key={item.step}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium capitalize">
                      {item.step.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>

                    <span className="text-muted-foreground">
                      {item.count.toLocaleString()}{" "}
                      ({item.conversionRate}%)
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(
                          item.conversionRate,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* Event Summary */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>
              Event Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="divide-y">
              {data.events.map((event) => (
                <div
                  key={event.eventName}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm font-medium capitalize">
                    {event.eventName.replaceAll(
                      "_",
                      " ",
                    )}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {event.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}